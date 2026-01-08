import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';
import { ICONS, COLOR_Hex, COLORS } from '../constants';

interface MonthlyViewProps {
    habits: Habit[];
    onToggle: (id: string, date: string) => void;
}

interface MonthData {
    month: number;
    year: number;
    days: (Date | null)[];
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ habits, onToggle }) => {
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(habits[0]?.id || null);

    const selectedHabit = habits.find(h => h.id === selectedHabitId);

    // Generate 3 months of data
    const monthsData = useMemo(() => {
        const months: MonthData[] = [];
        const today = new Date();

        for (let i = 0; i < 3; i++) {
            const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset + i, 1);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth();

            const lastDay = new Date(year, month + 1, 0).getDate();
            const firstDayWeekday = new Date(year, month, 1).getDay();
            // Convert to Monday start: 0=Sun becomes 6, 1=Mon becomes 0, etc.
            const startPadding = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

            const days: (Date | null)[] = [];

            // Add padding for days before the 1st
            for (let j = 0; j < startPadding; j++) {
                days.push(null);
            }

            // Add actual days
            for (let j = 1; j <= lastDay; j++) {
                days.push(new Date(year, month, j));
            }

            months.push({ month, year, days });
        }

        return months;
    }, [monthOffset]);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const colorHex = selectedHabit ? COLOR_Hex[selectedHabit.color] : '#a855f7';

    return (
        <div className="space-y-6">
            {/* Header with Habit Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-white">Monthly Overview</h2>

                {/* Habit Pills */}
                <div className="flex flex-wrap gap-2">
                    {habits.map(habit => {
                        const IconComponent = ICONS[habit.icon] || ICONS['activity'];
                        const colorClass = COLORS[habit.color];
                        const isSelected = selectedHabitId === habit.id;

                        return (
                            <button
                                key={habit.id}
                                onClick={() => setSelectedHabitId(habit.id)}
                                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300
                  ${isSelected
                                        ? `${colorClass} shadow-lg`
                                        : 'bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50'
                                    }
                `}
                            >
                                <IconComponent size={14} strokeWidth={2.5} />
                                <span className="text-xs font-medium">{habit.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => setMonthOffset(prev => prev - 3)}
                    className="p-2 bg-zinc-800/70 backdrop-blur border border-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-all"
                >
                    <ChevronLeft size={18} className="text-zinc-300" />
                </button>
                <button
                    onClick={() => setMonthOffset(0)}
                    className="px-4 py-2 bg-zinc-800/70 backdrop-blur border border-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-all text-sm font-medium text-zinc-300"
                >
                    Current
                </button>
                <button
                    onClick={() => setMonthOffset(prev => prev + 3)}
                    className="p-2 bg-zinc-800/70 backdrop-blur border border-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-all"
                >
                    <ChevronRight size={18} className="text-zinc-300" />
                </button>
            </div>

            {/* 3 Month Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {monthsData.map((monthData, idx) => (
                    <div
                        key={`${monthData.year}-${monthData.month}`}
                        className="bg-card border border-zinc-800/50 rounded-2xl p-4"
                    >
                        {/* Month Header */}
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-white">{monthNames[monthData.month]}</h3>
                            <p className="text-xs text-zinc-500">{monthData.year}</p>
                        </div>

                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map((day, i) => (
                                <div key={i} className="text-center text-[10px] text-zinc-600 font-medium">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {monthData.days.map((day, i) => {
                                if (!day) {
                                    return <div key={`empty-${i}`} className="aspect-square" />;
                                }

                                const dateStr = formatDate(day);
                                const isCompleted = selectedHabit?.completedDates.includes(dateStr) || false;
                                const isTodayDate = isToday(day);

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => selectedHabit && onToggle(selectedHabit.id, dateStr)}
                                        className={`
                      aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200
                      ${isCompleted
                                                ? 'text-white'
                                                : 'text-zinc-500 hover:bg-zinc-800'
                                            }
                      ${isTodayDate && !isCompleted ? 'ring-1 ring-zinc-500 text-white' : ''}
                    `}
                                        style={{
                                            backgroundColor: isCompleted ? colorHex : 'transparent'
                                        }}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Month Stats */}
                        {selectedHabit && (
                            <div className="mt-4 pt-3 border-t border-zinc-800/50">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">Completed</span>
                                    <span className="text-white font-medium">
                                        {monthData.days.filter(d => d && selectedHabit.completedDates.includes(formatDate(d))).length}
                                        <span className="text-zinc-500"> / {monthData.days.filter(d => d).length}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {habits.length === 0 && (
                <div className="text-center py-20 text-zinc-600">
                    <p>No habits yet. Create some habits to view monthly progress.</p>
                </div>
            )}
        </div>
    );
};

export default MonthlyView;
