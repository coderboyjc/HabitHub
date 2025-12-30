import React from 'react';
import { Habit } from '../types';
import { ICONS, COLORS } from '../constants';
import { X, Flame, Edit2, Settings, BarChart2 } from 'lucide-react';
import Heatmap from './Heatmap';
import Calendar from './Calendar';

interface HabitDetailProps {
  habit: Habit;
  onClose: () => void;
  onEdit: () => void;
  onToggle: (id: string, date: string) => void;
}

const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onClose, onEdit, onToggle }) => {
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
             <button className="w-12 h-12 bg-zinc-800/40 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all">
                <Settings size={20} />
            </button>
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
    </div>
  );
};

export default HabitDetail;