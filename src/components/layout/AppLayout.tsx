import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '../../hooks/useTheme';

const AppLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // Force background color based on theme
  const backgroundColor = isDarkMode ? '#111827' : '#f9fafb';
  
  return (
    <div 
      className="relative flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      style={{ backgroundColor }}
    >
      {/* Starfield Background - only visible in dark mode */}
      {/* <div
        className="fixed inset-0 pointer-events-none opacity-30 animate-twinkle dark:opacity-50 hidden dark:block"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.45), rgba(255,255,255,0)),
            radial-gradient(1.5px 1.5px at 70% 10%, rgba(255,255,255,.35), rgba(255,255,255,0)),
            radial-gradient(1.5px 1.5px at 30% 80%, rgba(255,255,255,.35), rgba(255,255,255,0)),
            radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,.3), rgba(255,255,255,0)),
            radial-gradient(1.5px 1.5px at 80% 60%, rgba(255,255,255,.3), rgba(255,255,255,0)),
            radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,.25), rgba(255,255,255,0))
          `
        }}
      /> */}

      {/* Nebula Background - only visible in dark mode */}
      {/* <div
        className="fixed inset-0 pointer-events-none hidden dark:block"
        style={{
          background: `
            radial-gradient(1200px 800px at 10% 10%, rgba(99,102,241,.08), transparent 60%),
            radial-gradient(1200px 800px at 90% 80%, rgba(6,182,212,.08), transparent 60%)
          `
        }}
      /> */}

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
