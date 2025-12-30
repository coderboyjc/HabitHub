import React, { useState } from 'react';
import { Habit, HabitColor } from '../types';
import { ICONS, COLORS } from '../constants';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface HabitFormProps {
  initialData?: Habit;
  onSave: (habit: Partial<Habit>) => void;
  onClose: () => void;
}

const COLOR_OPTIONS: HabitColor[] = ['green', 'yellow', 'pink', 'blue', 'purple', 'red', 'orange', 'cyan'];
const ICON_KEYS = Object.keys(ICONS);

const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSave, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [color, setColor] = useState<HabitColor>(initialData?.color || 'green');
  const [iconIndex, setIconIndex] = useState(initialData ? ICON_KEYS.indexOf(initialData.icon) : 0);

  const currentIconKey = ICON_KEYS[iconIndex];
  const CurrentIcon = ICONS[currentIconKey];

  const handleSave = () => {
    if (!name) return;
    onSave({
      id: initialData?.id,
      name,
      description,
      color,
      icon: currentIconKey,
      completedDates: initialData?.completedDates || []
    });
  };

  const nextIcon = () => setIconIndex((prev) => (prev + 1) % ICON_KEYS.length);
  const prevIcon = () => setIconIndex((prev) => (prev - 1 + ICON_KEYS.length) % ICON_KEYS.length);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background sm:bg-black/80 sm:backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full h-full sm:h-auto sm:max-w-md bg-background sm:bg-card sm:rounded-3xl p-6 overflow-y-auto border border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Habit' : 'New Habit'}</h2>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Icon Picker */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-6">
             {/* Invisible buttons for mobile alignment, visible interaction */}
            <button onClick={prevIcon} className="text-zinc-600 hover:text-white transition-colors">
                <ChevronLeft size={32} />
            </button>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${COLORS[color]} transition-colors duration-300 shadow-xl shadow-black/50`}>
              <CurrentIcon size={48} strokeWidth={2} />
            </div>
            <button onClick={nextIcon} className="text-zinc-600 hover:text-white transition-colors">
                <ChevronRight size={32} />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1 ml-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Reading"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1 ml-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Read 10 pages"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-8">
          <label className="block text-xs font-medium text-zinc-500 uppercase mb-3 ml-1">Color</label>
          <div className="grid grid-cols-4 gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-full aspect-square rounded-2xl ${COLORS[c]} flex items-center justify-center transition-transform hover:scale-105 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-70 hover:opacity-100'}`}
              >
                {color === c && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-4">
             <button className="text-zinc-500 text-sm flex items-center gap-1 hover:text-zinc-300">
                Advanced Options <ChevronRight size={14} className="rotate-90" />
             </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-900/20"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default HabitForm;