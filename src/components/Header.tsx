import React from 'react';
import { Cpu, Power } from 'lucide-react';

interface HeaderProps {
    isMonitoring: boolean;
    onToggleMonitoring: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMonitoring, onToggleMonitoring }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/5">
            <div className="container h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-highlight flex items-center justify-center border border-white/5">
                        <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-primary">
                            Sentinel<span className="text-secondary font-normal">AI</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isMonitoring ? 'bg-success' : 'bg-secondary'}`}></div>
                            <span className="text-[10px] text-secondary font-medium uppercase tracking-wide">
                                {isMonitoring ? 'System Active' : 'Standby'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-6">
                    {/* System Stats (Minimal) */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-secondary font-medium uppercase">Latency</span>
                            <span className="text-xs font-mono text-primary">{isMonitoring ? '12ms' : '--'}</span>
                        </div>
                    </div>

                    <div className="h-8 w-[1px] bg-white/5 hidden md:block"></div>

                    {/* Power Button */}
                    <button
                        onClick={onToggleMonitoring}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm
                            ${isMonitoring
                                ? 'bg-alert/10 text-alert hover:bg-alert/20'
                                : 'bg-success/10 text-success hover:bg-success/20'
                            }
                        `}
                    >
                        <Power className="w-4 h-4" />
                        <span>{isMonitoring ? 'Stop' : 'Start'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
