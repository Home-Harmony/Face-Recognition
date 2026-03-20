import React from 'react';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface DashboardProps {
    score: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ score }) => {
    const getStatusConfig = (score: number) => {
        if (score >= 70) return { color: 'text-success', bg: 'bg-success/20', border: 'border-success/30', text: 'Focused', icon: CheckCircle };
        if (score >= 40) return { color: 'text-accent', bg: 'bg-accent/20', border: 'border-accent/30', text: 'Distracted', icon: Eye };
        return { color: 'text-alert', bg: 'bg-alert/20', border: 'border-alert/30', text: 'Drowsy', icon: AlertTriangle };
    };

    const config = getStatusConfig(score);
    const Icon = config.icon;

    return (
        <div className="card p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="mb-6 relative">
                    {/* Outer Ring */}
                    <div className={`w-32 h-32 rounded-full border-4 ${config.border} flex items-center justify-center relative`}>
                        {/* Inner Ring with Glow */}
                        <div className={`w-24 h-24 rounded-full border-2 ${config.border} flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-surface-highlight/50 backdrop-blur-sm`}>
                            <span className="text-3xl font-bold font-mono text-primary">
                                {Math.round(score)}%
                            </span>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-primary mb-2">Current Status</h2>
                <div className={`flex items-center gap-2 text-lg font-medium ${config.color}`}>
                    <Icon className="w-6 h-6" />
                    <span>{config.text}</span>
                </div>
            </div>
        </div>
    );
};
