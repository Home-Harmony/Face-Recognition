import { useState, useEffect, useCallback } from 'react';

export interface Alert {
    id: string;
    type: 'drowsiness' | 'distraction' | 'normal';
    message: string;
    timestamp: Date;
}

export const useDriverSimulation = () => {
    const [attentionScore, setAttentionScore] = useState(100);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(true);

    const addAlert = useCallback((type: Alert['type'], message: string) => {
        const newAlert: Alert = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            message,
            timestamp: new Date(),
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep last 5
    }, []);

    useEffect(() => {
        if (!isMonitoring) return;

        const interval = setInterval(() => {
            setAttentionScore(prev => {
                // Simulate random fluctuation
                const change = (Math.random() - 0.5) * 10;
                let newScore = Math.max(0, Math.min(100, prev + change));

                // Occasional drops to simulate events
                if (Math.random() > 0.95) {
                    newScore -= 15;
                }

                // Trigger alerts based on score
                if (newScore < 30 && prev >= 30) {
                    addAlert('drowsiness', 'Driver drowsiness detected!');
                } else if (newScore < 50 && prev >= 50) {
                    addAlert('distraction', 'Driver distraction detected. Please focus.');
                }

                return newScore;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isMonitoring, addAlert]);

    return {
        attentionScore,
        alerts,
        isMonitoring,
        setIsMonitoring
    };
};
