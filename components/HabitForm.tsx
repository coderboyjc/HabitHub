import React, { useState } from 'react';
import { Habit, HabitColor } from '../types';
import { ICONS, COLORS } from '../constants';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import IconPicker from './IconPicker';

interface HabitFormProps {
  initialData?: Habit;
  onSave: (habit: Partial<Habit>) => void;
  onClose: () => void;
}

const COLOR_OPTIONS: HabitColor[] = [
  'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose',
  'red', 'orange', 'amber',
  'yellow', 'lime', 'slate'
];
const ICON_KEYS = Object.keys(ICONS);

const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSave, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [color, setColor] = useState<HabitColor>(initialData?.color || 'green');
  const [icon, setIcon] = useState(initialData?.icon || 'activity');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const CurrentIcon = ICONS[icon] || ICONS['activity'];

  const handleSave = () => {
    if (!name) return;
    onSave({
      id: initialData?.id,
      name,
      description,
      color,
      icon, // Use the icon state directly
      completedDates: initialData?.completedDates || []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 sm:bg-black/80 sm:backdrop-blur-md sm:items-center sm:justify-center">
      <div className="w-full h-full sm:h-auto sm:max-w-md glass-strong sm:rounded-3xl p-5 overflow-y-auto shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Habit' : 'New Habit'}</h2>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Icon Picker Trigger */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => setShowIconPicker(true)}
            className={`group relative w-24 h-24 rounded-full flex items-center justify-center ${COLORS[color]} transition-all duration-300 shadow-xl shadow-black/50 hover:scale-105 active:scale-95`}
          >
            <CurrentIcon size={48} strokeWidth={2} />
            <div className="absolute -bottom-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              CHANGE
            </div>
          </button>
          <p className="mt-3 text-white/40 text-xs font-medium uppercase tracking-wider">Tap icon to change</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-medium text-white/60 uppercase mb-1 ml-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Reading"
              className="w-full glass rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 uppercase mb-1 ml-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Read 10 pages"
              className="w-full glass rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-8">
          <label className="block text-xs font-medium text-white/60 uppercase mb-3 ml-1">Color</label>
          <div className="grid grid-cols-6 gap-4 px-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-full aspect-square rounded-xl ${COLORS[c]} flex items-center justify-center transition-transform hover:scale-105 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-70 hover:opacity-100'}`}
              >
                {color === c && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <button className="text-white/50 text-sm flex items-center gap-1 hover:text-white/80 transition-colors">
            Advanced Options <ChevronRight size={14} className="rotate-90" />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30"
        >
          Save
        </button>
      </div>

      {showIconPicker && (
        <IconPicker
          selectedIcon={icon}
          onSelect={(newIcon) => {
            setIcon(newIcon);
            setShowIconPicker(false);
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  );
};

export default HabitForm;