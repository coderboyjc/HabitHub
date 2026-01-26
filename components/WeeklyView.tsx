import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Habit } from '../types';
import { ICONS, COLOR_Hex, COLORS } from '../constants';
import { getLocalDateString, isFutureDate } from '../utils/dateUtils';

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

    const formatDate = (date: Date) => getLocalDateString(date);
    const isToday = (date: Date) => getLocalDateString(date) === getLocalDateString();

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
        <div className="space-y-4 sm:space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                {/* Controls */}
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    <div className="bg-zinc-800/50 p-1 rounded-xl flex items-center border border-zinc-700/50">
                        <button
                            onClick={() => setWeekOffset(prev => prev - 1)}
                            className="p-1.5 sm:p-2 hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <div className="px-2 sm:px-3 text-xs sm:text-sm font-medium text-white min-w-[100px] sm:min-w-[140px] text-center">
                            {weekOffset === 0 ? "This Week" : weekOffset === 1 ? "Next Week" : weekOffset === -1 ? "Last Week" : getWeekLabel()}
                        </div>
                        <button
                            onClick={() => setWeekOffset(prev => prev + 1)}
                            className="p-1.5 sm:p-2 hover:bg-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                    </div>

                    {weekOffset !== 0 && (
                        <button
                            onClick={() => setWeekOffset(0)}
                            className="text-[10px] sm:text-xs font-medium text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Days Header - Right Aligned on Desktop */}
                <div className="flex justify-end pr-2 sm:pr-4">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 w-[180px] sm:w-full sm:max-w-[400px]">
                        {getWeekDays.map((day, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className={`text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-0.5 ${isToday(day) ? 'text-white' : 'text-zinc-600'}`}>
                                    {dayNames[i][0]}
                                </span>
                                <span className={`text-[11px] sm:text-sm font-bold ${isToday(day) ? 'text-white underline underline-offset-4 decoration-white/30' : 'text-zinc-500'}`}>
                                    {day.getDate()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Habits List */}
            <div className="space-y-2 sm:space-y-3">
                {habits.map(habit => {
                    const IconComponent = ICONS[habit.icon] || ICONS['activity'];
                    const colorClass = COLORS[habit.color];
                    const colorHex = COLOR_Hex[habit.color];

                    return (
                        <div key={habit.id} className="group flex flex-row items-center gap-2 sm:gap-4 bg-zinc-900/50 border border-white/5 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 pr-2 sm:pr-4 hover:border-white/10 transition-colors">

                            {/* Habit Info */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pl-1">
                                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center ${colorClass} bg-opacity-20 text-white/90`}>
                                    <IconComponent size={20} strokeWidth={2} className="sm:w-6 sm:h-6" />
                                </div>
                                <div className={`
                            flex-1 px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/5 bg-white/5 
                            min-w-0
                        `}>
                                    <h3 className="text-white font-medium truncate text-xs sm:text-base">
                                        {habit.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Checkboxes Grid */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-2 w-[180px] sm:w-full sm:max-w-[400px] py-1">
                                {getWeekDays.map((day, i) => {
                                    const dateStr = formatDate(day);
                                    const isCompleted = habit.completedDates.includes(dateStr);
                                    const isFuture = isFutureDate(day);


                                    const isCurrentDay = isToday(day);

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => !isFuture && onToggle(habit.id, dateStr)}
                                            className={`
                                         aspect-square rounded sm:rounded-lg flex items-center justify-center transition-all duration-200
                                         ${isCompleted
                                                    ? 'shadow-md scale-95 sm:scale-100'
                                                    : `bg-zinc-800/30 border border-zinc-700/30 ${isFuture ? 'cursor-default' : 'hover:border-zinc-600'}`
                                                }
                                         ${isCurrentDay ? 'ring-2 ring-white/40 ring-offset-1 ring-offset-zinc-900' : ''}
                                     `}
                                            style={{
                                                backgroundColor: isCompleted ? colorHex : undefined,
                                            }}
                                        >
                                            {isCompleted && <Check size={12} strokeWidth={5} className="text-white drop-shadow-sm sm:w-4 sm:h-4 sm:stroke-[4]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {habits.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 sm:py-20 text-zinc-600">
                        <p>No habits tracked yet.</p>
                        <p className="text-sm mt-2">Create a new habit to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeeklyView;
