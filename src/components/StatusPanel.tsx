import React from 'react';
import { CheckCircle, EyeOff, Zap, AlertTriangle } from 'lucide-react';

interface StatusPanelProps {
    status: 'NORMAL' | 'DROWSY' | 'RAGE' | 'DISTRACTED' | 'NO_FACE';
    isMonitoring: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ status, isMonitoring }) => {
    const getStatusConfig = () => {
        if (!isMonitoring) {
            return {
                color: 'text-secondary',
                bg: 'bg-surface',
                icon: CheckCircle,
                text: 'Standby',
                subtext: 'System Ready',
            };
        }

        switch (status) {
            case 'DROWSY':
                return {
                    color: 'text-alert',
                    bg: 'bg-alert/10',
                    icon: EyeOff,
                    text: 'Drowsiness Detected',
                    subtext: 'Please take a break',
                };
            case 'RAGE':
                return {
                    color: 'text-accent',
                    bg: 'bg-accent/10',
                    icon: Zap,
                    text: 'High Stress',
                    subtext: 'Calm down',
                };
            case 'DISTRACTED':
                return {
                    color: 'text-accent',
                    bg: 'bg-accent/10',
                    icon: AlertTriangle,
                    text: 'Distracted',
                    subtext: 'Keep eyes on road',
                };
            case 'NO_FACE':
                return {
                    color: 'text-accent',
                    bg: 'bg-accent/10',
                    icon: AlertTriangle,
                    text: 'No Driver',
                    subtext: 'Face not detected',
                };
            default:
                return {
                    color: 'text-success',
                    bg: 'bg-success/10',
                    icon: CheckCircle,
                    text: 'Attentive',
                    subtext: 'System Active',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div className="card p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${config.bg}`}>
                    <Icon className={`w-8 h-8 ${config.color}`} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-primary tracking-tight">
                        {config.text}
                    </h2>
                    <p className="text-secondary text-sm font-medium mt-1">
                        {config.subtext}
                    </p>
                </div>
            </div>

            {/* Status Indicator Dot */}
            <div className="flex flex-col items-end gap-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? (status === 'NORMAL' ? 'bg-success' : 'bg-alert animate-pulse') : 'bg-secondary'}`}></div>
                <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                    {isMonitoring ? 'Live' : 'Offline'}
                </span>
            </div>
        </div>
    );
};
