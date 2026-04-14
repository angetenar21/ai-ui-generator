import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { usePageTitle } from '../../hooks/usePageTitle';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === '/';
  usePageTitle();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/gallery');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        navigate('/tester');
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF9F7] dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Global Ambient Glassmorphism Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        {/* SVG Noise Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.06] mix-blend-overlay pointer-events-none">
          <svg className="w-full h-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Static Background Blobs (Shifted to Cool Tones to make Orange UI Pop) */}
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] md:w-[70vw] max-w-[800px] h-[50vw] md:h-[70vw] max-h-[800px] bg-teal-500/8 md:bg-teal-500/10 dark:bg-teal-400/15 rounded-full blur-[80px] md:blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] md:w-[60vw] max-w-[700px] h-[45vw] md:h-[60vw] max-h-[700px] bg-blue-600/8 md:bg-blue-600/10 dark:bg-indigo-500/20 rounded-full blur-[70px] md:blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[30vw] md:w-[40vw] max-w-[400px] h-[30vw] md:h-[40vw] max-h-[400px] bg-cyan-500/5 dark:bg-cyan-400/10 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      {/* 100% Width Full-Space Navbar */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Play Area Container */}
      <div className="flex-1 flex flex-row min-h-0 relative z-10 w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className={`flex-1 ${isChatPage ? 'overflow-hidden p-0' : 'overflow-y-auto p-3 sm:p-4 md:p-6'} relative min-w-0 bg-transparent animate-fade-in`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
