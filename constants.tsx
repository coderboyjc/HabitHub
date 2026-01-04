import React from 'react';
import {
  Activity,
  Footprints,
  Code,
  Utensils,
  BookOpen,
  Droplets,
  Moon,
  Sun,
  Dumbbell,
  Music,
  Briefcase,
  Coffee,
  Heart,
  Zap,
  Leaf,
  PenTool
} from 'lucide-react';
import { HabitColor } from './types';

export const COLORS: Record<HabitColor, string> = {
  green: 'bg-green-500 text-green-50',
  yellow: 'bg-yellow-500 text-yellow-950',
  pink: 'bg-pink-500 text-pink-50',
  blue: 'bg-blue-500 text-blue-50',
  purple: 'bg-purple-500 text-purple-50',
  red: 'bg-red-500 text-red-50',
  orange: 'bg-orange-500 text-orange-50',
  cyan: 'bg-cyan-500 text-cyan-950',
};

export const COLOR_Hex: Record<HabitColor, string> = {
  green: '#4ade80',
  yellow: '#facc15',
  pink: '#f472b6',
  blue: '#60a5fa',
  purple: '#a855f7',
  red: '#ef4444',
  orange: '#f97316',
  cyan: '#06b6d4',
};

export const ICONS: Record<string, React.FC<any>> = {
  'activity': Activity,
  'footprints': Footprints,
  'code': Code,
  'utensils': Utensils,
  'book': BookOpen,
  'water': Droplets,
  'moon': Moon,
  'sun': Sun,
  'dumbbell': Dumbbell,
  'music': Music,
  'work': Briefcase,
  'coffee': Coffee,
  'heart': Heart,
  'zap': Zap,
  'leaf': Leaf,
  'pen': PenTool
};

export const INITIAL_HABITS: any[] = [
  {
    id: '1',
    name: 'Running',
    description: 'train to run',
    icon: 'activity',
    color: 'green',
    completedDates: []
  },
  {
    id: '2',
    name: 'walk',
    description: 'daily steps',
    icon: 'footprints',
    color: 'yellow',
    completedDates: []
  },
  {
    id: '3',
    name: 'coding',
    description: 'learning to code',
    icon: 'code',
    color: 'pink',
    completedDates: []
  },
  {
    id: '4',
    name: 'eating clean',
    description: 'no junk food',
    icon: 'utensils',
    color: 'blue',
    completedDates: []
  }
];

// Helper to generate some dummy history
const generateHistory = (habitId: string) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 100; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    // Random completion based on habit ID to make them look different
    if (Math.random() > 0.4) {
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
};

// Hydrate initial habits with data
INITIAL_HABITS.forEach(h => {
  h.completedDates = generateHistory(h.id);
});