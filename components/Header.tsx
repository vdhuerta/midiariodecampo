import React from 'react';
import MenuIcon from './icons/MenuIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import { UserInfo } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  userInfo: UserInfo;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, userInfo }) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-rose-100 shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-rose-200 p-2 rounded-lg flex-shrink-0">
            <BookOpenIcon className="h-6 w-6 text-rose-700" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-slate-800 whitespace-nowrap">Diario de Campo</h1>
            <p className="text-[9px] text-slate-600 truncate">{userInfo.name} {userInfo.surname}</p>
          </div>
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