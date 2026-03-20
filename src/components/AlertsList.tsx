import React from 'react';
import type { Alert } from '../hooks/useDriverSimulation';
import { AlertCircle, Bell } from 'lucide-react';

interface AlertsListProps {
    alerts: Alert[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
    return (
        <div className="card h-full flex flex-col">
            <div className="card-header">
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-semibold text-primary">Recent Alerts</h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {alerts.length === 0 ? (
                    <div className="text-center py-12 text-secondary text-sm border border-dashed border-white/5 rounded-lg">
                        No recent alerts detected
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${alert.type === 'drowsiness'
                                    ? 'bg-alert/5 border-alert/20'
                                    : 'bg-accent/5 border-accent/20'
                                }`}
                        >
                            <AlertCircle className={`w-5 h-5 mt-0.5 ${alert.type === 'drowsiness' ? 'text-alert' : 'text-accent'
                                }`} />
                            <div>
                                <p className={`text-sm font-medium ${alert.type === 'drowsiness' ? 'text-alert' : 'text-accent'
                                    }`}>
                                    {alert.message}
                                </p>
                                <p className="text-xs text-secondary mt-1 font-mono">
                                    {alert.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
