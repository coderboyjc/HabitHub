import React from 'react';
import { LayoutGrid, Calendar, CalendarDays, BookOpen } from 'lucide-react';
import { NavigationScreen } from '../types';

interface DynamicIslandProps {
    activeScreen: NavigationScreen;
    onScreenChange: (screen: NavigationScreen) => void;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ activeScreen, onScreenChange }) => {
    const navItems: { id: NavigationScreen; icon: React.FC<any>; label: string }[] = [
        { id: 'habits', icon: LayoutGrid, label: 'Habits' },
        { id: 'weekly', icon: Calendar, label: 'Weekly' },
        { id: 'monthly', icon: CalendarDays, label: 'Monthly' },
        { id: 'journal', icon: BookOpen, label: 'Journal' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            {/* Glass container with subtle glow */}
            <div className="relative">
                {/* Glow effect behind */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl rounded-full" />

                {/* Main glass island */}
                <div className="relative flex items-center gap-1 p-1.5 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-full shadow-2xl shadow-black/50">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeScreen === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onScreenChange(item.id)}
                                className={`
                  relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ease-out
                  ${isActive
                                        ? 'bg-white/15 text-white shadow-lg'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                    }
                `}
                            >
                                {/* Active indicator glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/30 rounded-full blur-sm" />
                                )}

                                <Icon
                                    size={18}
                                    className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />

                                {/* Show label only on active */}
                                <span
                                    className={`
                    relative z-10 text-sm font-medium overflow-hidden transition-all duration-300 ease-out
                    ${isActive ? 'w-auto max-w-[80px] opacity-100' : 'w-0 max-w-0 opacity-0'}
                  `}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DynamicIsland;
