import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Habit } from '../types';
import { ICONS, COLOR_Hex, COLORS } from '../constants';

interface WeeklyViewProps {
    habits: Habit[];
    onToggle: (id: string, date: string) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ habits, onToggle }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    // Get Monday of the current week with offset
    const getWeekDays = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay();
        // Calculate Monday: if Sunday (0), go back 6 days; otherwise go back (currentDay - 1) days
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push(day);
        }
        return days;
    }, [weekOffset]);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getWeekLabel = () => {
        const start = getWeekDays[0];
        const end = getWeekDays[6];
        const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
        const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
        const year = end.getFullYear();

        if (startMonth === endMonth) {
            return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
        }
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
    };

    return (
        <div className="space-y-6">
            {/* Week Navigation Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{getWeekLabel()}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setWeekOffset(prev => prev - 1)}
                        className="p-2 bg-zinc-800/70 backdrop-blur border border-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-all"
                    >
                        <ChevronLeft size={18} className="text-zinc-300" />
                    </button>
                    <button
                        onClick={() => setWeekOffset(0)}
                        className="px-3 py-2 bg-zinc-800/70 backdrop-blur border border-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-all text-sm font-medium text-zinc-300"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        className="p-2 bg-zinc-800/70 backdrop-blur border border-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-all"
                    >
                        <ChevronRight size={18} className="text-zinc-300" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-8 gap-2">
                <div className="text-sm font-medium text-zinc-500">Habits</div>
                {getWeekDays.map((day, i) => (
                    <div
                        key={i}
                        className={`
              text-center text-sm font-medium
              ${isToday(day) ? 'text-white' : 'text-zinc-500'}
            `}
                    >
                        <div>{dayNames[i]}</div>
                        <div className={`
              text-lg font-bold mt-1
              ${isToday(day) ? 'bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : ''}
            `}>
                            {day.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Habits Grid */}
            <div className="space-y-3">
                {habits.map(habit => {
                    const IconComponent = ICONS[habit.icon] || ICONS['activity'];
                    const colorHex = COLOR_Hex[habit.color];
                    const colorClass = COLORS[habit.color];

                    return (
                        <div
                            key={habit.id}
                            className="grid grid-cols-8 gap-2 items-center bg-card border border-zinc-800/50 rounded-2xl p-3"
                        >
                            {/* Habit Info */}
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                                    <IconComponent size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-medium text-white truncate hidden sm:block">{habit.name}</span>
                            </div>

                            {/* Day Cells */}
                            {getWeekDays.map((day, i) => {
                                const dateStr = formatDate(day);
                                const isCompleted = habit.completedDates.includes(dateStr);

                                return (
                                    <button
                                        key={i}
                                        onClick={() => onToggle(habit.id, dateStr)}
                                        className={`
                      w-full aspect-square max-w-[44px] mx-auto rounded-xl flex items-center justify-center transition-all duration-300
                      ${isCompleted
                                                ? 'shadow-lg'
                                                : 'bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/30'
                                            }
                    `}
                                        style={{
                                            backgroundColor: isCompleted ? colorHex : undefined,
                                            boxShadow: isCompleted ? `0 4px 20px ${colorHex}40` : undefined
                                        }}
                                    >
                                        {isCompleted && <Check size={18} strokeWidth={3} className="text-white" />}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {habits.length === 0 && (
                <div className="text-center py-20 text-zinc-600">
                    <p>No habits yet. Create some habits to track them weekly.</p>
                </div>
            )}
        </div>
    );
};

export default WeeklyView;
