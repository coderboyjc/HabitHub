import React, { useMemo, useRef, useEffect } from 'react';
import { HabitColor } from '../types';
import { COLOR_Hex } from '../constants';

interface HeatmapProps {
  completedDates: string[];
  color: HabitColor;
  days?: number; // Number of days to show, default 365 for yearly
  size?: 'sm' | 'lg';
}

// Day labels in Monday-first order: M, T, W, T, F, S, S
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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
  const gapClass = size === 'lg' ? 'gap-[4px]' : 'gap-[3px]';
  const squareSizeClass = size === 'lg' ? 'w-3 h-3 md:w-4 md:h-4' : 'w-2 h-2 md:w-2.5 md:h-2.5';

  return (
    <div className="w-full flex pt-1 pb-1">
      {/* Sticky labels column */}
      <div className={`sticky left-0 z-10 bg-card flex flex-col ${gapClass} pr-1`}>
        {DAY_LABELS.map((label, index) => (
          <div
            key={index}
            className={`${squareSizeClass} rounded-sm flex items-center justify-center text-zinc-500 text-[7px] font-medium leading-none`}
            style={{
              backgroundColor: '#27272a' // zinc-800 - matches empty heatmap squares
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Scrollable grid */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto no-scrollbar"
      >
        <div className={`grid grid-rows-7 grid-flow-col ${gapClass} w-max px-1`}>
          {gridData.map((day) => (
            <div
              key={day.date}
              className={`relative rounded-sm transition-colors duration-300 ${squareSizeClass}`}
              style={{
                backgroundColor: day.filled ? activeColor : '#27272a' // zinc-800
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;