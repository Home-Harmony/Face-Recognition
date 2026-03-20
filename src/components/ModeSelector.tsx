import React from 'react';
import { Shield, Zap, User } from 'lucide-react';

interface ModeSelectorProps {
    currentMode: 'RIDESHARE' | 'EMERGENCY' | 'PRIVATE';
    onModeChange: (mode: 'RIDESHARE' | 'EMERGENCY' | 'PRIVATE') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
    const modes = [
        { id: 'PRIVATE', label: 'Standard', sub: 'Balanced', icon: User },
        { id: 'RIDESHARE', label: 'Pro', sub: 'High Sensitivity', icon: Shield },
        { id: 'EMERGENCY', label: 'Emergency', sub: 'Max Alert', icon: Zap },
    ] as const;

    return (
        <div className="flex items-center bg-surface-highlight/50 p-1 rounded-xl border border-white/5">
            {modes.map((mode) => {
                const Icon = mode.icon;
                const isActive = currentMode === mode.id;

                return (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        className={`
                            relative flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300
                            ${isActive ? 'bg-surface shadow-soft text-primary' : 'text-secondary hover:text-primary hover:bg-white/5'}
                        `}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-secondary'}`} />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium leading-none">{mode.label}</span>
                            {isActive && (
                                <span className="text-[10px] text-secondary mt-1 font-medium tracking-wide">
                                    {mode.sub}
                                </span>
                            )}
                        </div>

                        {/* Active Indicator Line */}
                        {isActive && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-accent rounded-full mb-1.5"></div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
