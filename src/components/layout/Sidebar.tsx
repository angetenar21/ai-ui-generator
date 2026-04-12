import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Grid3x3, Code, History, FlaskConical, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, clearGeneratedComponents, setCurrentThreadId, triggerNewChat, currentThreadId, lastActiveThreadId } = useAppStore();

  const navItems = [
    { to: '/', icon: MessageSquare, label: 'Chat' },
    { to: '/gallery', icon: Grid3x3, label: 'Gallery' },
    { to: '/inspector', icon: Code, label: 'Inspector' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/tester', icon: FlaskConical, label: 'Tester' },
  ];

  // Compute active jobs for badge
  const { activeThreads } = useAppStore();
  const activeJobCount = Object.values(activeThreads).filter(t => t.isLoading).length;

  // Handle new chat
  const handleNewChat = () => {
    clearGeneratedComponents();
    setCurrentThreadId(null);
    triggerNewChat(); // Signal ChatPage to reset
    navigate('/');
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isNewChatActive = location.pathname === '/' && currentThreadId === null;

  // On mobile (< lg), when the sidebar drawer is open, always show expanded with labels.
  // sidebarOpen is only meaningful on mobile (desktop uses lg:translate-x-0).
  const effectiveCollapsed = sidebarOpen ? false : sidebarCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className={`mobile-sidebar bg-[#FFFBF5]/90 dark:bg-gray-900/90 backdrop-blur-md
                   border border-stone-200 dark:border-gray-800
                   transform transition-all duration-300 z-30
                   flex flex-col flex-shrink-0
                   absolute inset-y-0 left-0 h-full rounded-none shadow-2xl
                   lg:relative lg:h-[calc(100%-1.5rem)] lg:ml-4 lg:mt-2 lg:mb-4 lg:rounded-2xl lg:shadow-xl
                   ${effectiveCollapsed ? 'w-[72px] lg:w-20' : 'w-[200px] sm:w-56 lg:w-56'}
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Collapse/Expand Button - Desktop Only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full
                     bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                     items-center justify-center
                     hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110
                     active:scale-95
                     transition-all duration-200
                     text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm z-40"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>


        <div className="mobile-sidebar-content flex-1 flex flex-col p-3 pt-2 lg:p-4 lg:pt-6 overflow-y-auto overflow-x-hidden">

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`font-medium rounded-xl flex items-center justify-center shadow-sm group relative transition-all duration-300 flex-shrink-0
                        ${isNewChatActive ? 'bg-gradient-to-r from-orange-500 to-pink-600' : 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600'} text-white 
                        ${effectiveCollapsed ? 'w-12 h-12 p-0 mx-auto mb-4 lg:mb-8' : 'w-full py-2.5 lg:py-3 px-4 mb-4 lg:mb-8'}`}
            title={effectiveCollapsed ? 'New Chat' : undefined}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />

            {/* Smooth CSS Transition for Label */}
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap
                ${effectiveCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-2'}
              `}
            >
              New Chat
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => {
                  const actualIsActive = item.to === '/' ? (isActive && currentThreadId !== null) : isActive;
                  return `flex items-center rounded-xl transition-all duration-200
                   hover:translate-x-1 group relative flex-shrink-0
                   ${effectiveCollapsed ? 'justify-center p-0 w-12 h-12 mx-auto' : 'gap-3 px-4 py-3 w-full'}
                   ${actualIsActive
                      ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-md'
                      : 'text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-gray-800'
                    }`;
                }}
                onClick={(e) => {
                  // If clicking Chat while on New Chat screen, attempt to restore last active chat
                  if (item.label === 'Chat' && currentThreadId === null && lastActiveThreadId) {
                    e.preventDefault(); // Prevent standard router nav that might overwrite state inappropriately before our effect
                    setCurrentThreadId(lastActiveThreadId);
                    navigate('/');
                  }

                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                title={effectiveCollapsed ? item.label : undefined}
              >
                {({ isActive }) => {
                  const actualIsActive = item.to === '/' ? (isActive && currentThreadId !== null) : isActive;
                  return (
                    <>
                      <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${actualIsActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />

                      {/* Smooth CSS Transition for Label */}
                      <span
                        className={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap
                        ${effectiveCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 flex-1'}
                      `}
                      >
                        {item.label}
                      </span>

                      {/* Active Job Badge */}
                      {item.label === 'Chat' && activeJobCount > 0 && (
                        <div className={`
                      flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded-full
                      ${effectiveCollapsed ? 'absolute -top-1 -right-1 w-4 h-4' : 'px-2 py-0.5 ml-auto'}
                      animate-pulse shadow-sm
                    `}>
                          {effectiveCollapsed ? '' : `${activeJobCount} running`}
                        </div>
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

      </motion.aside>
    </>
  );
};

export default Sidebar;
