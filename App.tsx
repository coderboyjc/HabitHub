import React, { useState } from 'react';
import { Settings, BarChart2, Plus } from 'lucide-react';
import { Habit, ViewState, NavigationScreen, JournalEntry } from './types';
import { INITIAL_HABITS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import HabitCard from './components/HabitCard';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';
import DynamicIsland from './components/DynamicIsland';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import JournalView from './components/JournalView';

const App: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habithub-habits', INITIAL_HABITS);
  const [view, setView] = useState<ViewState>('list');
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<NavigationScreen>('habits');
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('habithub-journal', []);

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

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  // Render the appropriate screen based on activeScreen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'weekly':
        return (
          <WeeklyView
            habits={habits}
            onToggle={toggleHabitCompletion}
          />
        );
      case 'monthly':
        return (
          <MonthlyView
            habits={habits}
            onToggle={toggleHabitCompletion}
          />
        );
      case 'journal':
        return (
          <JournalView
            habits={habits}
            entries={journalEntries}
            onAddEntry={handleAddJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
          />
        );
      case 'habits':
      default:
        return (
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
              <div className="text-center py-20 text-white/50">
                <p>No habits yet. Click + to start.</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-white font-sans pb-28 selection:bg-blue-500/30">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 glass-strong border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button className="text-white/70 hover:text-white transition-colors">
            <Settings size={24} />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">HabitStop</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block glass rounded-full px-3 py-1 text-xs font-semibold text-white/80">PRO</div>
            <button className="text-white/70 hover:text-white transition-colors">
              <BarChart2 size={24} />
            </button>
            <button
              onClick={() => { setActiveHabitId(null); setView('create'); }}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Plus size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        {renderScreen()}
      </main>

      {/* Dynamic Island Navigation */}
      <DynamicIsland
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
      />

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
          onDelete={handleDeleteHabit}
        />
      )}

    </div>
  );
};

export default App;