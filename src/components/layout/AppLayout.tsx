import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 100% Width Full-Space Navbar */}
      <Header />

      {/* Play Area Container */}
      <div className="flex-1 flex flex-row min-h-0 relative z-10 w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className={`flex-1 ${isChatPage ? 'overflow-hidden p-0' : 'overflow-y-auto p-6'} relative min-w-0 bg-transparent animate-fade-in`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
