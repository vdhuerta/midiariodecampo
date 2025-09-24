import React from 'react';
import MenuIcon from './icons/MenuIcon';
import BookOpenIcon from './icons/BookOpenIcon';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-rose-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-rose-200 p-2 rounded-lg">
            <BookOpenIcon className="h-6 w-6 text-rose-700" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">Diario de Campo</h1>
        </div>
      <button 
        onClick={toggleSidebar} 
        className="p-1 rounded-md text-slate-600 hover:bg-rose-200" 
        aria-label="Abrir menú"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;
