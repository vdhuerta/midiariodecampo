import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';
import TargetIcon from './icons/TargetIcon';
import LibraryIcon from './icons/LibraryIcon';
import HomeIcon from './icons/HomeIcon';
import ChartLineIcon from './icons/ChartLineIcon';
import XIcon from './icons/XIcon';
import { View } from '../App';


interface SidebarProps {
  isSidebarOpen: boolean;
  currentView: View;
  setView: (view: View) => void;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, currentView, setView, closeSidebar }) => {
  
  const NavItem: React.FC<{ view: View, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-rose-200 text-rose-800'
            : 'text-slate-600 hover:bg-rose-200 hover:text-slate-900'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-rose-100 p-4 flex flex-col shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menú principal"
      >
        <div className="flex items-center justify-between gap-3 px-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-200 p-2 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-rose-700" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">Diario de Campo</h1>
          </div>
          <button 
            onClick={closeSidebar} 
            className="md:hidden p-1 rounded-md text-slate-600 hover:bg-rose-200"
            aria-label="Cerrar menú"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col space-y-1">
          <NavItem view="DASHBOARD" label="Inicio" icon={<HomeIcon className="h-5 w-5" />} />
          <NavItem view="JOURNAL" label="Diario de Campo" icon={<BookOpenIcon className="h-5 w-5" />} />
          <NavItem view="PROGRESS" label="Progreso" icon={<ChartLineIcon className="h-5 w-5" />} />
          <NavItem view="GOALS" label="Metas Profesionales" icon={<TargetIcon className="h-5 w-5" />} />
          <NavItem view="RESOURCES" label="Recursos" icon={<LibraryIcon className="h-5 w-5" />} />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;