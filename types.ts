export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  completedDates: string[]; // YYYY-MM-DD
}

export type HabitColor = 'green' | 'yellow' | 'pink' | 'blue' | 'purple' | 'red' | 'orange' | 'cyan' | 'lime' | 'emerald' | 'teal' | 'sky' | 'indigo' | 'violet' | 'fuchsia' | 'rose' | 'amber' | 'slate';

export interface IconOption {
  name: string;
  label: string;
}

export type ViewState = 'list' | 'create' | 'edit' | 'detail';

export type NavigationScreen = 'habits' | 'weekly' | 'monthly' | 'journal';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  habitId?: string; // Optional: link to a specific habit
  createdAt: string;
}