import React, { useState, useEffect } from "react";
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import { FaceMesh } from "@mediapipe/face_mesh";
import type { DriverState } from "../hooks/useDriverAI";

interface CameraFeedProps {
    webcamRef: React.RefObject<Webcam | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    driverState: DriverState;
    isInitialized: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ webcamRef, canvasRef, driverState, isInitialized }) => {


    //  FaceMesh setup
    useEffect(() => {
        const faceMesh = new FaceMesh({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results) => {
            if (results.multiFaceLandmarks?.length > 0) {
                const landmarks = results.multiFaceLandmarks[0];

                const leftEye = [
                    landmarks[33],
                    landmarks[160],
                    landmarks[158],
                    landmarks[133],
                ];

                const vertical = Math.abs(leftEye[1].y - leftEye[2].y);
                const horizontal = Math.abs(leftEye[0].x - leftEye[3].x);

                const ear = vertical / horizontal;

            }
        });

        const processFrame = async () => {
            if (webcamRef.current?.video) {
                await faceMesh.send({ image: webcamRef.current.video });
            }
            requestAnimationFrame(processFrame);
        };

        processFrame();

        return () => {
            faceMesh.close();
        };
    }, [webcamRef]);

    return (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-soft border border-white/5">
            
            {driverState.ear < 0.25 && (
                <div className="absolute top-5 left-5 bg-red-600 text-white p-2 rounded z-20">
                    ⚠️ Driver Drowsy!
                </div>
            )}

            {!isInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                        <p className="text-secondary font-medium">Initializing AI Models...</p>
                    </div>
                </div>
            )}

            <Webcam
                ref={webcamRef}
                audio={false}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user"
                }}
            />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 z-10">
                <div className="w-2 h-2 rounded-full bg-alert animate-pulse" />
                <span className="text-xs font-medium text-white tracking-wider">LIVE FEED</span>
                <Camera className="w-3 h-3 text-secondary" />
            </div>

            {/* Live Metrics Panel */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/5 text-xs font-mono shadow-lg">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between gap-8">
                            <span className="text-secondary">FPS</span>
                            <span className="text-success">{driverState.fps}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-secondary">EYE OPENNESS</span>
                            <span className={driverState.ear < 0.25 ? "text-alert font-bold" : "text-primary"}>
                                {driverState.ear.toFixed(3)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-secondary">HEAD VELOCITY</span>
                            <span className={driverState.headVelocity > 5 ? "text-accent font-bold" : "text-primary"}>
                                {driverState.headVelocity.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* No Face Detected Warning */}
                {isInitialized && driverState.status === 'NO_FACE' && (
                    <div className="bg-alert/20 backdrop-blur-md px-4 py-2 rounded-lg border border-alert/50 animate-pulse">
                        <span className="text-alert font-bold tracking-wider text-sm">NO FACE DETECTED</span>
                    </div>
                )}
            </div>
        </div>
    );
};