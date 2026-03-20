import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceMesh, FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE, FACEMESH_FACE_OVAL } from '@mediapipe/face_mesh';
import type { Results } from '@mediapipe/face_mesh';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import { playAlertSound, stopAudio } from '../utils/audio';
import Webcam from 'react-webcam';

// Types
export interface DriverState {
    isDrowsy: boolean;
    isRage: boolean;
    ear: number;
    fps: number;
    headVelocity: number;
    status: 'NORMAL' | 'DROWSY' | 'RAGE' | 'NO_FACE';
}

export interface LogEntry {
    id: string;
    timestamp: string; // ISO string for easier serialization
    type: 'DROWSINESS' | 'RAGE';
}

// Constants
// Constants
// Note: Constants are now defined dynamically in MODE_CONFIGS inside the hook


export const useDriverAI = (videoRef: React.RefObject<Webcam | null>, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const [driverState, setDriverState] = useState<DriverState>({
        isDrowsy: false,
        isRage: false,
        ear: 0,
        fps: 0,
        headVelocity: 0,
        status: 'NORMAL',
    });

    // Load logs from localStorage on mount
    const [logs, setLogs] = useState<LogEntry[]>(() => {
        try {
            const saved = localStorage.getItem('driver_logs');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isInitialized, setIsInitialized] = useState(false);

    const [isMonitoring, setIsMonitoring] = useState(false);

    const [driverMode, setDriverMode] = useState<'RIDESHARE' | 'EMERGENCY' | 'PRIVATE'>('PRIVATE');
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    const [alertCount, setAlertCount] = useState(0);

    // Refs for logic to avoid re-renders
    const frameCounter = useRef(0);
    const rageFrameCounter = useRef(0);
    const lastProcessTime = useRef(0);
    const lastNosePos = useRef<{ x: number, y: number } | null>(null);
    const distractionStartTime = useRef<number | null>(null);
    const lastAudioTime = useRef<number>(0);

    // Auto-delete logs older than 3 days on mount
    useEffect(() => {
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLogs(prev => prev.filter(log => new Date(log.timestamp).getTime() > threeDaysAgo));
    }, []);

    // Persist logs whenever they change
    useEffect(() => {
        localStorage.setItem('driver_logs', JSON.stringify(logs));
    }, [logs]);

    const clearLogs = useCallback(() => {
        setLogs([]);
        localStorage.removeItem('driver_logs');
    }, []);

    const toggleMonitoring = useCallback(() => {
        setIsMonitoring(prev => {
            const newState = !prev;
            if (newState) {
                setSessionStartTime(Date.now());
                setAlertCount(0);
            } else {
                setSessionStartTime(null);
            }
            return newState;
        });

        // Reset state on toggle
        setDriverState(prev => ({
            ...prev,
            isDrowsy: false,
            isRage: false,
            status: 'NORMAL'
        }));
        frameCounter.current = 0;
        distractionStartTime.current = null;
    }, []);

    // Placeholder for TF.js Emotion Detection
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const predictEmotion = async (_videoElement: HTMLVideoElement) => {
        // TODO: Load TF.js model and predict emotion
        // const predictions = await model.predict(videoElement);
        // return predictions;
        return { angry: 0.1, neutral: 0.9 }; // Stub
    };

    // EAR Calculation
    // Indices for left eye: [362, 385, 387, 263, 373, 380] (MediaPipe 468 landmarks)
    // Indices for right eye: [33, 160, 158, 133, 153, 144]
    // Note: MediaPipe indices are different from standard 68-point dlib.
    // Using approximation points for MediaPipe Face Mesh:
    // Left Eye: 33 (inner), 133 (outer), 160 (top1), 158 (top2), 144 (bottom1), 153 (bottom2)
    // Right Eye: 362 (inner), 263 (outer), 385 (top1), 387 (top2), 380 (bottom1), 373 (bottom2)

    // Right Eye: 362 (inner), 263 (outer), 385 (top1), 387 (top2), 380 (bottom1), 373 (bottom2)

    const calculateEAR = (landmarks: { x: number; y: number }[]) => {
        const getDist = (p1: number, p2: number) => {
            const x = landmarks[p1].x - landmarks[p2].x;
            const y = landmarks[p1].y - landmarks[p2].y;
            return Math.sqrt(x * x + y * y);
        };

        // Right Eye (User's left on screen)
        const rightEyeEAR =
            (getDist(160, 144) + getDist(158, 153)) /
            (2 * getDist(33, 133));

        // Left Eye (User's right on screen)
        const leftEyeEAR =
            (getDist(385, 380) + getDist(387, 373)) /
            (2 * getDist(362, 263));

        return (leftEyeEAR + rightEyeEAR) / 2;
    };

    const calculateHeadVelocity = (landmarks: { x: number; y: number }[], deltaTime: number) => {
        const nose = landmarks[1]; // Nose tip
        if (!lastNosePos.current) {
            lastNosePos.current = { x: nose.x, y: nose.y };
            return 0;
        }

        const dx = nose.x - lastNosePos.current.x;
        const dy = nose.y - lastNosePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Velocity = distance / time (in seconds)
        // Scale up for readability
        const velocity = (distance / (deltaTime / 1000)) * 10;

        lastNosePos.current = { x: nose.x, y: nose.y };
        return velocity;
    };

    const onResults = useCallback((results: Results) => {
        if (!isMonitoring) return;

        // Draw Face Mesh
        if (canvasRef.current && videoRef.current?.video) {
            const videoWidth = videoRef.current.video.videoWidth;
            const videoHeight = videoRef.current.video.videoHeight;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const canvasCtx = canvasRef.current.getContext('2d');
            if (canvasCtx) {
                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                // Flip the canvas horizontally to match the mirrored webcam
                canvasCtx.translate(canvasRef.current.width, 0);
                canvasCtx.scale(-1, 1);

                if (results.multiFaceLandmarks) {
                    for (const landmarks of results.multiFaceLandmarks) {
                        drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                            { color: '#C0C0C070', lineWidth: 1 });
                        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE,
                            { color: '#FF3030', lineWidth: 2 });
                        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE,
                            { color: '#FF3030', lineWidth: 2 });
                        drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL,
                            { color: '#E0E0E0', lineWidth: 1 });
                    }
                }
                canvasCtx.restore();
            }
        }

        const now = Date.now();
        const deltaTime = now - lastProcessTime.current;
        const fps = 1000 / deltaTime;
        lastProcessTime.current = now;

        // Handle No Face Detected
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setDriverState(prev => ({
                ...prev,
                isDrowsy: false,
                isRage: false,
                ear: 0,
                fps: Math.round(fps),
                headVelocity: 0,
                status: 'NO_FACE'
            }));
            frameCounter.current = 0;
            rageFrameCounter.current = 0;

            // Mode Config for No Face (duplicated for scope access - efficient enough)
            const noFaceDebounce = driverMode === 'EMERGENCY' ? 1000 : (driverMode === 'RIDESHARE' ? 3000 : 5000);

            // Debounce audio for NO_FACE
            if (Date.now() - lastAudioTime.current > noFaceDebounce) {
                playAlertSound('no_face');
                lastAudioTime.current = Date.now();
            }
            return;
        }

        const landmarks = results.multiFaceLandmarks[0];
        const ear = calculateEAR(landmarks);
        const headVelocity = calculateHeadVelocity(landmarks, deltaTime);

        // Mode Configuration
        const MODE_CONFIGS = {
            PRIVATE: { // Standard
                earThreshold: 0.25,
                distractionThreshold: 1.5,
                drowsyFrames: 10,
                rageFrames: 2,
                noFaceDebounce: 5000
            },
            RIDESHARE: { // Pro
                earThreshold: 0.28, // More sensitive to droopy eyes
                distractionThreshold: 1.2, // More sensitive to looking away
                drowsyFrames: 8, // Faster reaction
                rageFrames: 2,
                noFaceDebounce: 3000
            },
            EMERGENCY: { // Emergency
                earThreshold: 0.30, // Max sensitivity
                distractionThreshold: 0.8, // Any sudden move triggers alert
                drowsyFrames: 4, // Instant reaction
                rageFrames: 1, // Instant reaction
                noFaceDebounce: 1000 // Immediate warning
            }
        };

        const config = MODE_CONFIGS[driverMode] || MODE_CONFIGS.PRIVATE;

        // Drowsiness Logic
        if (ear < config.earThreshold) {
            frameCounter.current++;
        } else {
            frameCounter.current = 0;
        }

        const isDrowsy = frameCounter.current >= config.drowsyFrames;

        // Distraction/Rage Logic
        if (headVelocity > config.distractionThreshold) {
            rageFrameCounter.current++;
        } else {
            rageFrameCounter.current = 0;
        }

        const isRage = rageFrameCounter.current >= config.rageFrames;

        let status: DriverState['status'] = 'NORMAL';
        if (isDrowsy) status = 'DROWSY';
        if (isRage) status = 'RAGE';

        if (status === 'NORMAL') {
            stopAudio();
        }

        setDriverState({
            isDrowsy,
            isRage,
            ear,
            fps: Math.round(fps),
            headVelocity,
            status,
        });

        // Trigger Alerts & Logs
        if (isDrowsy || isRage) {
            const type = isDrowsy ? 'DROWSINESS' : 'RAGE';

            // Debounce audio: only play if 3 seconds have passed since last audio
            if (Date.now() - lastAudioTime.current > 3000) {
                playAlertSound(isDrowsy ? 'drowsiness' : 'rage');
                lastAudioTime.current = Date.now();
            }

            setAlertCount(prev => prev + 1);

            setLogs(prev => {
                // Debounce logs: don't log if same type occurred in last 3 seconds
                if (prev.length > 0 && prev[0].type === type) {
                    const lastTime = new Date(prev[0].timestamp).getTime();
                    if (now - lastTime < 3000) return prev;
                }

                const newLog: LogEntry = {
                    id: crypto.randomUUID(),
                    timestamp: new Date().toISOString(),
                    type
                };
                return [newLog, ...prev].slice(0, 50); // Keep last 50 logs
            });
        }
    }, [isMonitoring, driverMode, videoRef, canvasRef]); // Added driverMode dependency

    useEffect(() => {
        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);

        if (videoRef.current && videoRef.current.video) {
            const camera = new Camera(videoRef.current.video, {
                onFrame: async () => {
                    if (videoRef.current?.video) {
                        await faceMesh.send({ image: videoRef.current.video });
                        // Placeholder for emotion detection
                        // await predictEmotion(videoRef.current.video);
                    }
                },
                width: 640,
                height: 480,
            });
            camera.start();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsInitialized(true);

            return () => {
                camera.stop();
                faceMesh.close();
            };
        }
    }, [videoRef, onResults]);

    return {
        driverState,
        logs,
        isInitialized,
        clearLogs,
        isMonitoring,
        toggleMonitoring,
        driverMode,
        setDriverMode,
        sessionStartTime,
        alertCount,
        predictEmotion
    };
};
