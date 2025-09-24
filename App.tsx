import React, { useState, useCallback, useEffect } from 'react';
import { JournalEntry, Goal } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import JournalView from './components/JournalView';
import Dashboard from './components/Dashboard';
import GoalsView from './components/GoalsView';
import ResourcesView from './components/ResourcesView';
import ProgressView from './components/ProgressView';
import Header from './components/Header';
import DimensionesView from './components/DimensionesView';

export type View = 'DASHBOARD' | 'JOURNAL' | 'GOALS' | 'RESOURCES' | 'PROGRESS' | 'DIMENSIONS';

const App: React.FC = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('professionalGoals', []);
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Recalculate goal progress whenever entries change
    const goalProgressMap = new Map<string, number>();
    goals.forEach(g => goalProgressMap.set(g.id, 0));

    entries.forEach(entry => {
      entry.linkedGoals.forEach(lg => {
        const currentProgress = goalProgressMap.get(lg.goalId) || 0;
        goalProgressMap.set(lg.goalId, currentProgress + lg.progress);
      });
    });
    
    const needsUpdate = goals.some(goal => {
        const newProgress = Math.min(goalProgressMap.get(goal.id) || 0, 100);
        return newProgress !== goal.progress || (newProgress >= 100) !== goal.completed;
    });

    if (needsUpdate) {
        setGoals(prevGoals =>
          prevGoals.map(goal => {
            const newProgress = Math.min(goalProgressMap.get(goal.id) || 0, 100);
            return {
              ...goal,
              progress: newProgress,
              completed: newProgress >= 100,
            };
          })
        );
    }
  }, [entries, goals, setGoals]);


  const addEntry = useCallback((newEntry: Omit<JournalEntry, 'id'>) => {
    setEntries(prev => [{ ...newEntry, id: new Date().toISOString() + Math.random() }, ...prev]);
  }, [setEntries]);

  const updateEntry = useCallback((updatedEntry: JournalEntry) => {
    setEntries(prev => prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry)));
  }, [setEntries]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, [setEntries]);

  const addGoal = useCallback((text: string) => {
    setGoals(prev => [...prev, { id: new Date().toISOString() + Math.random(), text, completed: false, progress: 0 }]);
  }, [setGoals]);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    // Also remove links from entries
    setEntries(prevEntries => prevEntries.map(entry => ({
        ...entry,
        linkedGoals: entry.linkedGoals.filter(lg => lg.goalId !== id)
    })));
  }, [setGoals, setEntries]);
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  const handleSetView = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard setView={handleSetView} entries={entries} goals={goals} />;
      case 'JOURNAL':
        return (
          <JournalView
            entries={entries}
            goals={goals}
            addEntry={addEntry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
          />
        );
      case 'GOALS':
        return <GoalsView goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} />;
      case 'RESOURCES':
        return <ResourcesView />;
      case 'PROGRESS':
        return <ProgressView entries={entries} />;
      case 'DIMENSIONS':
        return <DimensionesView />;
      default:
        return <Dashboard setView={handleSetView} entries={entries} goals={goals} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-green-50 text-slate-900 overflow-hidden">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        currentView={currentView} 
        setView={handleSetView} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;