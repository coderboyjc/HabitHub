import React, { useMemo, useRef, useEffect } from 'react';
import { HabitColor } from '../types';
import { COLOR_Hex } from '../constants';

interface HeatmapProps {
  completedDates: string[];
  color: HabitColor;
  days?: number; // Number of days to show, default 365 for yearly
  size?: 'sm' | 'lg';
}

const Heatmap: React.FC<HeatmapProps> = ({ completedDates, color, days = 365, size = 'sm' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate the last N days
  const gridData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Create grid data for N days ending today
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      data.push({
        date: dateStr,
        filled: completedDates.includes(dateStr)
      });
    }
    return data;
  }, [days, completedDates]);

  // Scroll to the end (today) on mount or when data changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [gridData]);

  const activeColor = COLOR_Hex[color];

  return (
    <div 
        ref={scrollRef} 
        className="w-full overflow-x-auto no-scrollbar pt-2 pb-2"
    >
      <div className={`grid grid-rows-7 grid-flow-col gap-[3px] ${size === 'lg' ? 'gap-[4px]' : ''} w-max px-1`}>
        {gridData.map((day) => (
          <div
            key={day.date}
            className={`relative rounded-sm transition-colors duration-300 ${size === 'lg' ? 'w-3 h-3 md:w-4 md:h-4' : 'w-2 h-2 md:w-2.5 md:h-2.5'}`}
            style={{
              backgroundColor: day.filled ? activeColor : '#27272a' // zinc-800
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Heatmap;