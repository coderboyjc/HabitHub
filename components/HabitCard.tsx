import React from 'react';
import { Habit } from '../types';
import { ICONS, COLORS } from '../constants';
import Heatmap from './Heatmap';
import { Check } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, date: string) => void;
  onClick: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onClick }) => {
  const IconComponent = ICONS[habit.icon] || ICONS['activity'];
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  // Determine color class for the icon container
  const colorClass = COLORS[habit.color];

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(habit.id, today);
  };

  return (
    <div
      className="bg-card rounded-2xl p-3 sm:p-4 border border-zinc-800/50 hover:border-zinc-700 transition-all group"
    >
      <div
        onClick={() => onClick(habit)}
        className="flex justify-between items-start mb-2 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
            <IconComponent size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{habit.name}</h3>
            <p className="text-sm text-zinc-400 font-medium">{habit.description}</p>
          </div>
        </div>

        <button
          onClick={handleCheck}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
            ${isCompletedToday ? '' : 'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-600'}
          `}
          style={isCompletedToday ? { backgroundColor: colorClass.split(' ')[0].replace('bg-', 'var(--tw-colors-') } : {}}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompletedToday ? colorClass : ''}`}>
            {isCompletedToday ? <Check size={28} strokeWidth={4} /> : null}
          </div>
        </button>
      </div>

      <div className="pt-2">
        <Heatmap
          completedDates={habit.completedDates}
          color={habit.color}
        />
      </div>
    </div>
  );
};

export default HabitCard;