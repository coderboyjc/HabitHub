export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  completedDates: string[]; // YYYY-MM-DD
}

export type HabitColor = 'green' | 'yellow' | 'pink' | 'blue' | 'purple' | 'red' | 'orange' | 'cyan';

export interface IconOption {
  name: string;
  label: string;
}

export type ViewState = 'list' | 'create' | 'edit' | 'detail';