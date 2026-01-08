import React, { useState, useRef, useEffect } from 'react';
import { Habit } from '../types';
import { ICONS, COLORS } from '../constants';
import { X, Flame, Edit2, Settings, BarChart2, Archive, Trash2 } from 'lucide-react';
import Heatmap from './Heatmap';
import Calendar from './Calendar';

interface HabitDetailProps {
    habit: Habit;
    onClose: () => void;
    onEdit: () => void;
    onToggle: (id: string, date: string) => void;
    onDelete?: (id: string) => void;
    onArchive?: (id: string) => void;
}

const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onClose, onEdit, onToggle, onDelete, onArchive }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleArchive = () => {
        setShowDropdown(false);
        if (onArchive) {
            onArchive(habit.id);
        }
    };

    const handleDeleteClick = () => {
        setShowDropdown(false);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete(habit.id);
        }
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };
    const IconComponent = ICONS[habit.icon] || ICONS['activity'];
    const colorClass = COLORS[habit.color];

    // Calculate streak (simple version)
    const calculateStreak = () => {
        let streak = 0;
        const sortedDates = [...habit.completedDates].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if today or yesterday is completed to start streak
        let currentDateToCheck = sortedDates.includes(today) ? today : (sortedDates.includes(yesterday) ? yesterday : null);

        if (!currentDateToCheck) return 0;

        for (let i = 0; i < sortedDates.length; i++) {
            // This simple logic assumes sortedDates has no gaps if it's a perfect streak, 
            // but robust logic needs date diff checks. 
            // For visual demo, let's just count consecutive days backwards.
            const d = new Date(currentDateToCheck);
            d.setDate(d.getDate() - streak);
            const dateString = d.toISOString().split('T')[0];

            if (habit.completedDates.includes(dateString)) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak();

    return (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-card border border-zinc-800 rounded-[32px] overflow-hidden max-h-[95vh] overflow-y-auto no-scrollbar shadow-2xl">

                {/* Header */}
                <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
                            <IconComponent size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{habit.name}</h2>
                            <p className="text-zinc-400 font-medium">{habit.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Large Heatmap */}
                <div className="p-6">
                    <div className="bg-background/50 rounded-2xl p-4 border border-zinc-800/50">
                        <Heatmap completedDates={habit.completedDates} color={habit.color} size="lg" />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="px-6 flex gap-3 mb-8">
                    <div className="flex-1 bg-zinc-800/40 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3">
                        <span className="text-zinc-500 text-sm font-medium">No Streak Goal</span>
                    </div>
                    <div className="bg-zinc-800/40 border border-zinc-800 rounded-2xl p-3 px-5 flex items-center gap-2">
                        <Flame size={20} className={currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-zinc-600'} />
                        <span className="text-white font-bold">{currentStreak}</span>
                    </div>
                    <button onClick={onEdit} className="w-12 h-12 bg-zinc-800/40 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all">
                        <Edit2 size={20} />
                    </button>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-12 h-12 bg-zinc-800/40 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
                        >
                            <Settings size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                                <button
                                    onClick={handleArchive}
                                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-zinc-300 hover:bg-zinc-800 transition-colors"
                                >
                                    <Archive size={18} />
                                    <span className="font-medium">Archive</span>
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-red-400 hover:bg-zinc-800 transition-colors border-t border-zinc-800"
                                >
                                    <Trash2 size={18} />
                                    <span className="font-medium">Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar */}
                <div className="px-6 pb-8">
                    <Calendar
                        completedDates={habit.completedDates}
                        color={habit.color}
                        onToggleDate={(date) => onToggle(habit.id, date)}
                    />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-center w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Delete Habit?</h3>
                        <p className="text-zinc-400 text-center mb-6">
                            Are you sure you want to delete <span className="text-white font-semibold">"{habit.name}"</span>? Once deleted, all data will be lost and cannot be recovered.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-2xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitDetail;