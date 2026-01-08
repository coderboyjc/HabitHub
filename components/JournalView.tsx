import React, { useState, useMemo } from 'react';
import { Plus, Calendar, X, Filter, BookOpen, ChevronDown } from 'lucide-react';
import { Habit, JournalEntry } from '../types';
import { ICONS, COLORS } from '../constants';

interface JournalViewProps {
    habits: Habit[];
    entries: JournalEntry[];
    onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
    onDeleteEntry: (id: string) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ habits, entries, onAddEntry, onDeleteEntry }) => {
    const [isAddingEntry, setIsAddingEntry] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [entryContent, setEntryContent] = useState('');
    const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);
    const [filterHabitId, setFilterHabitId] = useState<string | null>(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Filter entries
    const filteredEntries = useMemo(() => {
        let result = [...entries];

        if (filterHabitId) {
            result = result.filter(e => e.habitId === filterHabitId);
        }

        // Sort by date (newest first)
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return result;
    }, [entries, filterHabitId]);

    // Group entries by date
    const groupedEntries = useMemo(() => {
        const groups: { [date: string]: JournalEntry[] } = {};

        filteredEntries.forEach(entry => {
            if (!groups[entry.date]) {
                groups[entry.date] = [];
            }
            groups[entry.date].push(entry);
        });

        return groups;
    }, [filteredEntries]);

    const handleSubmit = () => {
        if (!entryContent.trim()) return;

        onAddEntry({
            date: selectedDate,
            content: entryContent.trim(),
            habitId: selectedHabitId
        });

        setEntryContent('');
        setSelectedHabitId(undefined);
        setIsAddingEntry(false);
    };

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

    const filterHabit = habits.find(h => h.id === filterHabitId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen size={22} className="text-purple-400" />
                    Journal
                </h2>

                <div className="flex items-center gap-2">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium
                ${filterHabitId
                                    ? `${COLORS[filterHabit?.color || 'purple']} shadow-lg`
                                    : 'bg-zinc-800/70 backdrop-blur border border-zinc-700/50 text-zinc-300 hover:bg-zinc-700'
                                }
              `}
                        >
                            <Filter size={16} />
                            {filterHabitId ? filterHabit?.name : 'All'}
                            <ChevronDown size={14} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showFilterMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden z-50">
                                <button
                                    onClick={() => { setFilterHabitId(null); setShowFilterMenu(false); }}
                                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-2
                    ${!filterHabitId ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-300 hover:bg-zinc-800'}
                  `}
                                >
                                    <div className="w-6 h-6 bg-zinc-700 rounded-lg flex items-center justify-center">
                                        <BookOpen size={12} />
                                    </div>
                                    All Entries
                                </button>
                                {habits.map(habit => {
                                    const IconComponent = ICONS[habit.icon] || ICONS['activity'];
                                    const colorClass = COLORS[habit.color];

                                    return (
                                        <button
                                            key={habit.id}
                                            onClick={() => { setFilterHabitId(habit.id); setShowFilterMenu(false); }}
                                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-2
                        ${filterHabitId === habit.id ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-300 hover:bg-zinc-800'}
                      `}
                                        >
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${colorClass}`}>
                                                <IconComponent size={12} />
                                            </div>
                                            {habit.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setIsAddingEntry(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all text-sm font-medium border border-purple-500/30"
                    >
                        <Plus size={16} />
                        Add Note
                    </button>
                </div>
            </div>

            {/* Add Entry Modal */}
            {isAddingEntry && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-card border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">New Journal Entry</h3>
                            <button
                                onClick={() => setIsAddingEntry(false)}
                                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Date Picker */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-xl px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>
                            </div>

                            {/* Habit Selector */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Link to Habit (Optional)</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedHabitId(undefined)}
                                        className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${!selectedHabitId
                                                ? 'bg-zinc-600 text-white'
                                                : 'bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50'
                                            }
                    `}
                                    >
                                        None
                                    </button>
                                    {habits.map(habit => {
                                        const IconComponent = ICONS[habit.icon] || ICONS['activity'];
                                        const colorClass = COLORS[habit.color];

                                        return (
                                            <button
                                                key={habit.id}
                                                onClick={() => setSelectedHabitId(habit.id)}
                                                className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                          ${selectedHabitId === habit.id
                                                        ? `${colorClass} shadow-lg`
                                                        : 'bg-zinc-800/70 text-zinc-400 hover:bg-zinc-700 border border-zinc-700/50'
                                                    }
                        `}
                                            >
                                                <IconComponent size={12} />
                                                {habit.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Note</label>
                                <textarea
                                    value={entryContent}
                                    onChange={(e) => setEntryContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    rows={5}
                                    className="w-full bg-zinc-800/70 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setIsAddingEntry(false)}
                                className="flex-1 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!entryContent.trim()}
                                className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Journal Entries */}
            <div className="space-y-6">
                {Object.keys(groupedEntries).length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={28} className="text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 font-medium">No journal entries yet</p>
                        <p className="text-zinc-600 text-sm mt-1">Start writing to track your thoughts</p>
                    </div>
                ) : (
                    Object.entries(groupedEntries).map(([date, dateEntries]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="px-3 py-1.5 bg-zinc-800/70 rounded-lg text-sm font-medium text-zinc-300">
                                    {formatDateDisplay(date)}
                                </div>
                                <div className="flex-1 h-px bg-zinc-800/50" />
                            </div>

                            {/* Entries for this date */}
                            <div className="space-y-3 pl-2">
                                {dateEntries.map(entry => {
                                    const linkedHabit = habits.find(h => h.id === entry.habitId);
                                    const IconComponent = linkedHabit ? (ICONS[linkedHabit.icon] || ICONS['activity']) : null;

                                    return (
                                        <div
                                            key={entry.id}
                                            className="group relative bg-card border border-zinc-800/50 rounded-2xl p-4 hover:border-zinc-700/50 transition-all"
                                        >
                                            {/* Linked Habit Badge */}
                                            {linkedHabit && (
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium mb-3 ${COLORS[linkedHabit.color]}`}>
                                                    {IconComponent && <IconComponent size={12} />}
                                                    {linkedHabit.name}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed">{entry.content}</p>

                                            {/* Timestamp */}
                                            <p className="text-xs text-zinc-600 mt-3">
                                                {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                            </p>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => onDeleteEntry(entry.id)}
                                                className="absolute top-3 right-3 w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JournalView;
