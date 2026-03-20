import React from 'react';
import { Shield, Lock, Server, Trash2 } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <Shield className="w-5 h-5 text-success" />
                <h3 className="text-lg font-bold text-white font-sans">Privacy & Data Policy</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                        <Lock className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white mb-1">On-Device Processing</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">All processing occurs locally. No video data leaves your device.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                        <Server className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white mb-1">No Cloud Storage</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">We do not store or transmit your personal biometric data.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="p-2 rounded-full bg-orange-500/10 text-orange-400">
                        <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white mb-1">Auto-Deletion</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Session data is automatically cleared after 3 days.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
