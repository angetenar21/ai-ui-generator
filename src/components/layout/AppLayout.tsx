import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '../../hooks/useTheme';

const AppLayout: React.FC = () => {
  const { isDarkMode } = useTheme();

  // Force background color based on theme
  const backgroundColor = isDarkMode ? '#111827' : '#f9fafb';

  const location = useLocation();
  const isChatPage = location.pathname === '/';

  return (
    <div
      className="relative flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      style={{ backgroundColor }}
    >
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />

        <main className={`flex-1 ${isChatPage ? 'overflow-hidden p-0' : 'overflow-y-auto p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
