import React from 'react';
import type { Alert } from '../hooks/useDriverSimulation';
import { AlertCircle, Bell } from 'lucide-react';

interface AlertsListProps {
    alerts: Alert[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {

    return (
        <div className="h-full flex flex-col bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-accent animate-pulse" />
                    <h3 className="text-lg font-semibold text-white">
                        Alerts
                    </h3>
                </div>

                <span className="text-xs text-secondary bg-white/5 px-2 py-1 rounded-md">
                    {alerts.length} items
                </span>
            </div>

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-white/10">

                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-secondary text-sm border border-dashed border-white/10 rounded-xl animate-fadeIn">
                        <Bell className="w-8 h-8 mb-3 opacity-50" />
                        No alerts detected
                    </div>
                ) : (
                    alerts.map((alert) => {

                        const isDrowsy = alert.type === 'drowsiness';

                        return (
                            <div
                                key={alert.id}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md 
                                ${isDrowsy
                                        ? 'bg-red-500/10 border-red-500/30'
                                        : 'bg-blue-500/10 border-blue-500/30'
                                    }`}
                            >

                                {/* Icon */}
                                <AlertCircle
                                    className={`w-5 h-5 mt-1 ${isDrowsy ? 'text-red-400' : 'text-blue-400'
                                        }`}
                                />

                                {/* Content */}
                                <div className="flex flex-col">

                                    <p
                                        className={`text-sm font-semibold ${isDrowsy ? 'text-red-400' : 'text-blue-400'
                                            }`}
                                    >
                                        {alert.message}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1 font-mono">
                                        {alert.timestamp.toLocaleTimeString()}
                                    </p>

                                </div>

                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};