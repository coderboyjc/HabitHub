import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HabitColor } from '../types';
import { COLOR_Hex } from '../constants';

interface CalendarProps {
  completedDates: string[];
  color: HabitColor;
  viewMode?: 'month' | 'week';
  onToggleDate?: (date: string) => void;
  hideHeader?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ completedDates, color, viewMode = 'month', onToggleDate, hideHeader = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const activeColor = COLOR_Hex[color];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Helper: Get the Monday of the week for a given date
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    // If Sunday (0), subtract 6 days. If Mon (1), subtract 0. If Tue (2), subtract 1...
    // Formula: date - (day === 0 ? 6 : day - 1)
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    const newDate = new Date(d);
    newDate.setDate(diff);
    return newDate;
  };

  const getDaysForView = () => {
    if (viewMode === 'month') {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dateObj = new Date(year, month + 1, 0); // Last day of current month
        const daysCount = dateObj.getDate();
        
        const days: (Date | null)[] = [];
        
        // Calculate start padding (Monday start)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // 0=Sun (pad 6), 1=Mon (pad 0), 2=Tue (pad 1)...
        const startDayMon = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        for (let i = 0; i < startDayMon; i++) {
            days.push(null); 
        }
        
        for (let i = 1; i <= daysCount; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    } else {
        // Weekly View
        const start = getStartOfWeek(currentDate);
        const days: (Date | null)[] = [];
        for(let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    }
  };

  const days = getDaysForView();

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
    } else {
        newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
     const newDate = new Date(currentDate);
     if (viewMode === 'month') {
         newDate.setMonth(newDate.getMonth() + 1);
     } else {
         newDate.setDate(newDate.getDate() + 7);
     }
     setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  };

  const formatHeader = () => {
      if (viewMode === 'month') {
        return currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        const start = getStartOfWeek(currentDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        // If same month
        if (start.getMonth() === end.getMonth()) {
            return start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        // If different months (or years)
        return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      }
  };

  return (
    <div className="flex flex-col w-full text-zinc-400 select-none">
      {/* Calendar Header with Navigation */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
            <button className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white border border-zinc-700/50 min-w-[120px]" onClick={() => setCurrentDate(new Date())}>
            <span className="text-sm font-medium">{formatHeader()}</span>
            </button>
            <div className="flex gap-2">
                <button onClick={handlePrev} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white border border-zinc-700/50">
                    <ChevronLeft size={18} />
                </button>
                <button onClick={handleNext} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white border border-zinc-700/50">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      )}

      {/* Weekday Headers */}
      <div className={`grid grid-cols-7 mb-2 text-center text-xs font-medium text-zinc-500 ${hideHeader ? 'mt-1' : ''}`}>
        {weekDays.map(d => <div key={d}>{d}</div>)}
      </div>

      {/* Days Grid */}
      <div className={`grid grid-cols-7 gap-y-4 gap-x-2 text-center content-start ${viewMode === 'month' ? 'min-h-[240px]' : ''}`}>
        {days.map((day, i) => {
          if (!day) return <div key={`placeholder-${i}`} />;
          
          const y = day.getFullYear();
          const m = String(day.getMonth() + 1).padStart(2, '0');
          const d = String(day.getDate()).padStart(2, '0');
          const dateStr = `${y}-${m}-${d}`;
          
          const isCompleted = completedDates.includes(dateStr);
          const isCurrentDay = isToday(day);

          return (
            <div key={dateStr} className="flex flex-col items-center justify-center">
              <button
                onClick={() => onToggleDate && onToggleDate(dateStr)}
                className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isCompleted ? 'text-zinc-950 font-bold' : 'text-zinc-400 hover:bg-zinc-800'}
                    ${isCurrentDay && !isCompleted ? 'border border-zinc-500 text-white' : ''}
                `}
                style={{
                    backgroundColor: isCompleted ? activeColor : 'transparent'
                }}
              >
                {day.getDate()}
              </button>
              {isCompleted && (
                  <div className="w-1 h-1 rounded-full mt-1" style={{ backgroundColor: activeColor }}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;