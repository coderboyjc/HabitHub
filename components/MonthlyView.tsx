import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Habit } from '../types';
import { ICONS, COLOR_Hex } from '../constants';
import { getLocalDateString, isFutureDate } from '../utils/dateUtils';

interface MonthlyViewProps {
    habits: Habit[];
    onToggle: (id: string, date: string) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ habits, onToggle }) => {
    const [monthOffset, setMonthOffset] = useState(0);

    const targetDate = useMemo(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth() + monthOffset, 1);
    }, [monthOffset]);

    const monthData = useMemo(() => {
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const firstDayWeekday = new Date(year, month, 1).getDay();
        // Convert to Monday start: 0=Sun becomes 6, 1=Mon becomes 0, etc.
        const startPadding = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

        const days: (Date | null)[] = [];
        for (let j = 0; j < startPadding; j++) {
            days.push(null);
        }
        for (let j = 1; j <= lastDay; j++) {
            days.push(new Date(year, month, j));
        }
        return { month, year, days };
    }, [targetDate]);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-center gap-4 py-2">
                <button
                    onClick={() => setMonthOffset(prev => prev - 1)}
                    className="p-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full transition-colors"
                >
                    <ChevronLeft size={20} className="text-zinc-400" />
                </button>
                <div className="text-center min-w-[140px]">
                    <h2 className="text-lg font-bold text-white">
                        {monthNames[monthData.month]} {monthData.year}
                    </h2>
                </div>
                <button
                    onClick={() => setMonthOffset(prev => prev + 1)}
                    className="p-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full transition-colors"
                >
                    <ChevronRight size={20} className="text-zinc-400" />
                </button>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {habits.map(habit => (
                    <HabitMonthCard
                        key={habit.id}
                        habit={habit}
                        monthData={monthData}
                        onToggle={onToggle}
                    />
                ))}
                {habits.length === 0 && (
                    <div className="col-span-full text-center py-20 text-zinc-600">
                        <p>No habits yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface HabitMonthCardProps {
    habit: Habit;
    monthData: {
        month: number;
        year: number;
        days: (Date | null)[];
    };
    onToggle: (id: string, date: string) => void;
}

const HabitMonthCard: React.FC<HabitMonthCardProps> = ({ habit, monthData, onToggle }) => {
    const IconComponent = ICONS[habit.icon] || ICONS['activity'];
    const colorHex = COLOR_Hex[habit.color];

    const completionsInMonth = useMemo(() => {
        return monthData.days.filter(day => {
            if (!day) return false;
            return habit.completedDates.includes(getLocalDateString(day));
        }).length;
    }, [habit.completedDates, monthData]);

    return (
        <div className="bg-[#1c1c1e] rounded-2xl p-3 flex flex-col gap-3 shadow-md border border-zinc-800/30">
            {/* Header: Icon + Name */}
            <div className="flex items-center gap-1.5 overflow-hidden">
                <IconComponent size={14} className="text-zinc-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-white truncate leading-none">
                    {habit.name}
                </span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-[3px]">
                {monthData.days.map((day, i) => {
                    if (!day) {
                        return <div key={`empty-${i}`} className="aspect-square" />;
                    }

                    const dateStr = getLocalDateString(day);
                    const isCompleted = habit.completedDates.includes(dateStr);
                    const isToday = getLocalDateString() === dateStr;

                    const isFuture = isFutureDate(day);

                    return (
                        <button
                            key={dateStr}
                            onClick={() => !isFuture && onToggle(habit.id, dateStr)}
                            className={`
                                aspect-square rounded-[3px] transition-all duration-200
                                ${isCompleted ? '' : `bg-zinc-800/40 ${isFuture ? 'cursor-default' : 'hover:bg-zinc-700/60'}`}
                                ${isToday && !isCompleted ? 'ring-1 ring-zinc-500/50' : ''}
                            `}
                            style={{
                                backgroundColor: isCompleted ? colorHex : undefined
                            }}
                        />
                    );
                })}
            </div>

            {/* Footer Summary Button - Toggle Today */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(habit.id, getLocalDateString());
                }}
                className="mt-auto py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 group/footer"
                style={{
                    backgroundColor: habit.completedDates.includes(getLocalDateString())
                        ? colorHex
                        : `${colorHex}15`
                }}
            >
                <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${habit.completedDates.includes(getLocalDateString())
                        ? 'bg-white'
                        : 'bg-zinc-700/50'
                        }`}
                >
                    <Check
                        size={10}
                        className={habit.completedDates.includes(getLocalDateString()) ? '' : 'text-zinc-500'}
                        style={{ color: habit.completedDates.includes(getLocalDateString()) ? colorHex : undefined }}
                        strokeWidth={4}
                    />
                </div>
                {completionsInMonth > 0 && (
                    <span className={`text-[10px] font-bold ${habit.completedDates.includes(getLocalDateString())
                        ? 'text-white'
                        : 'text-white/90'
                        }`}>
                        × {completionsInMonth}
                    </span>
                )}
            </button>
        </div>
    );
};

export default MonthlyView;
