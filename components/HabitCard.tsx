import React from 'react';
import { Habit } from '../types';
import { ICONS, COLORS } from '../constants';
import Heatmap from './Heatmap';
import { Check } from 'lucide-react';
import { getLocalDateString } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, date: string) => void;
  onClick: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onClick }) => {
  const IconComponent = ICONS[habit.icon] || ICONS['activity'];
  const today = getLocalDateString();
  const isCompletedToday = habit.completedDates.includes(today);

  // Determine color class for the icon container
  const colorClass = COLORS[habit.color];

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(habit.id, today);
  };

  return (
    <div
      className="glass rounded-2xl p-2 sm:p-4 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group hover:bg-white/10"
    >
      <div
        onClick={() => onClick(habit)}
        className="flex justify-between items-start mb-1 cursor-pointer"
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
            ${isCompletedToday ? '' : 'glass hover:bg-white/10 text-zinc-400'}
          `}
          style={isCompletedToday ? { backgroundColor: colorClass.split(' ')[0].replace('bg-', 'var(--tw-colors-') } : {}}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompletedToday ? colorClass : ''}`}>
            {isCompletedToday ? <Check size={28} strokeWidth={4} /> : null}
          </div>
        </button>
      </div>

      <div className="pt-1">
        <Heatmap
          completedDates={habit.completedDates}
          color={habit.color}
        />
      </div>
    </div>
  );
};

export default HabitCard;