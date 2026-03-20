import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionInfoProps {
    startTime: number | null;
    alertCount: number;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({ startTime, alertCount }) => {
    const [elapsed, setElapsed] = useState('00:00:00');

    useEffect(() => {
        if (!startTime) {
            if (elapsed !== '00:00:00') {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setElapsed('00:00:00');
            }
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - startTime;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsed(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-3 px-4 py-2 bg-surface-highlight/50 rounded-lg border border-white/5">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="font-mono text-sm text-primary tracking-wider font-medium">{elapsed}</span>
            </div>

            {/* Alerts Counter */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300 ${alertCount > 0
                ? 'bg-alert/10 border-alert/20 text-alert animate-pulse'
                : 'bg-surface-highlight/50 border-white/5 text-secondary'
                }`}>
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono text-xs font-bold tracking-widest">ALERTS: {alertCount}</span>
            </div>
        </div>
    );
};
