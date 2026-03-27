import React from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';
import type { DriverState } from '../hooks/useDriverAI';

interface CameraFeedProps {
    webcamRef: React.RefObject<Webcam | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    driverState: DriverState;
    isInitialized: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
    webcamRef,
    canvasRef,
    driverState,
    isInitialized
}) => {

    const isDrowsy = driverState.ear < 0.25;
    const isMoving = driverState.headVelocity > 5;
    const noFace = driverState.status === 'NO_FACE';

    return (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10 shadow-lg">

            {/* Loading Screen */}
            {!isInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                        <p className="text-secondary font-medium">
                            Initializing AI Models...
                        </p>
                    </div>
                </div>
            )}

            {/* Webcam */}
            <Webcam
                ref={webcamRef}
                audio={false}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user"
                }}
            />

            {/* Face Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* LIVE Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-white tracking-wider">
                    LIVE
                </span>
                <Camera className="w-3 h-3 text-gray-300" />
            </div>

            {/* STATUS ALERTS (no popup, UI based) */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">

                {noFace && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg 
               animate-[fadeIn_0.5s_ease-in-out]">
               No Face Detected
</div>
                )}

                {isDrowsy && (
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                        Drowsiness Detected
                    </div>
                )}

                {isMoving && (
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                        Excessive Movement
                    </div>
                )}

            </div>

            {/* Metrics Panel */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs font-mono shadow-lg z-10">

                <div className="flex flex-col gap-2">

                    <div className="flex justify-between gap-10">
                        <span className="text-gray-400">FPS</span>
                        <span className="text-green-400">{driverState.fps}</span>
                    </div>

                    <div className="flex justify-between gap-10">
                        <span className="text-gray-400">EYE</span>
                        <span className={isDrowsy ? "text-red-400 font-bold" : "text-white"}>
                            {driverState.ear.toFixed(3)}
                        </span>
                    </div>

                    <div className="flex justify-between gap-10">
                        <span className="text-gray-400">HEAD</span>
                        <span className={isMoving ? "text-yellow-400 font-bold" : "text-white"}>
                            {driverState.headVelocity.toFixed(2)}
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
};