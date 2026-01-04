import React, { useState, useEffect } from 'react';
import { Settings, BarChart2, Plus } from 'lucide-react';
import { Habit, ViewState } from './types';
import { INITIAL_HABITS } from './constants';
import HabitCard from './components/HabitCard';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [view, setView] = useState<ViewState>('list');
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);

  const activeHabit = habits.find(h => h.id === activeHabitId);

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const exists = h.completedDates.includes(date);
        let newDates = exists
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date];
        return { ...h, completedDates: newDates };
      }
      return h;
    }));
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (habitData.id) {
      // Update
      setHabits(prev => prev.map(h => h.id === habitData.id ? { ...h, ...habitData } as Habit : h));
    } else {
      // Create
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitData.name!,
        description: habitData.description || '',
        icon: habitData.icon || 'activity',
        color: habitData.color || 'green',
        completedDates: []
      };
      setHabits(prev => [...prev, newHabit]);
    }
    setView('list');
    setActiveHabitId(null);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setActiveHabitId(null);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans pb-24 selection:bg-purple-500/30">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Settings size={24} />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">HabitStop</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block border border-zinc-700 rounded px-2 py-0.5 text-xs font-bold text-zinc-300">PRO</div>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <BarChart2 size={24} />
            </button>
            <button
              onClick={() => { setActiveHabitId(null); setView('create'); }}
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Plus size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabitCompletion}
              onClick={(h) => { setActiveHabitId(h.id); setView('detail'); }}
            />
          ))}
          {habits.length === 0 && (
            <div className="text-center py-20 text-zinc-600">
              <p>No habits yet. Click + to start.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {(view === 'create' || view === 'edit') && (
        <HabitForm
          initialData={activeHabit}
          onClose={() => setView('list')}
          onSave={handleSaveHabit}
        />
      )}

      {view === 'detail' && activeHabit && (
        <HabitDetail
          habit={activeHabit}
          onClose={() => { setActiveHabitId(null); setView('list'); }}
          onEdit={() => setView('edit')}
          onToggle={toggleHabitCompletion}
        />
      )}

    </div>
  );
};

export default App;