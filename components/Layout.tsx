
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-green-50 text-slate-900">
      {children}
    </div>
  );
};

export default Layout;