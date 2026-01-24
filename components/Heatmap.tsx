import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { HabitColor } from '../types';
import { COLOR_Hex } from '../constants';
import { getLocalDateString } from '../utils/dateUtils';

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

  // Generate the last N days, aligned to Monday-first weeks
  const gridData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Calculate the oldest date we want to show (approximately N days ago)
    const oldestDate = new Date(today);
    oldestDate.setDate(today.getDate() - (days - 1));

    // Find the Monday of the week containing the oldest date
    // getDay() returns: 0=Sunday, 1=Monday, 2=Tuesday, etc.
    const oldestDayOfWeek = oldestDate.getDay();
    // Convert to Monday-first: Sunday (0) -> 6 days back, Monday (1) -> 0, Tuesday (2) -> 1, etc.
    const daysFromMonday = oldestDayOfWeek === 0 ? 6 : oldestDayOfWeek - 1;

    // Start from the Monday of that week (this ensures proper alignment)
    const startDate = new Date(oldestDate);
    startDate.setDate(oldestDate.getDate() - daysFromMonday);

    // Generate all days from start Monday to today
    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      const dateStr = getLocalDateString(currentDate);
      data.push({
        date: dateStr,
        filled: completedDates.includes(dateStr)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }, [days, completedDates]);

  // Scroll to the end (today) on mount or when data changes
  useLayoutEffect(() => {
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
      <div className={`sticky left-0 z-10 flex flex-col ${gapClass} pr-1`}>
        {DAY_LABELS.map((label, index) => (
          <div
            key={index}
            className={`${squareSizeClass} rounded-sm flex items-center justify-center text-white/40 text-[7px] font-medium leading-none`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)' // Subtle glass effect matching empty squares
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
          {gridData.map((day) => {
            const isToday = day.date === getLocalDateString();
            return (
              <div
                key={day.date}
                className={`relative rounded-sm transition-colors duration-300 ${squareSizeClass} ${isToday ? 'ring-1 ring-white/50 ring-offset-[1px] ring-offset-[#09090b]' : ''}`}
                style={{
                  backgroundColor: day.filled ? activeColor : 'rgba(255, 255, 255, 0.05)' // Subtle glass effect for empty squares
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;