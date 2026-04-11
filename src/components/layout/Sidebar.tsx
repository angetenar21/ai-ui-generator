import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Grid3x3, Code, History, FlaskConical, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

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

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`relative bg-[#FFFBF5]/90 dark:bg-gray-900/90 backdrop-blur-md
                   border border-stone-200 dark:border-gray-800
                   transform transition-all duration-300 z-30
                   flex flex-col flex-shrink-0 animate-slide-in-left
                   h-[calc(100%-1.5rem)] ml-4 mt-2 mb-4 rounded-2xl shadow-xl
                   ${sidebarCollapsed ? 'w-20' : 'w-56'}
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

        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end mb-4 p-4 pb-0">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-4 pt-6 overflow-y-auto">

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`font-medium rounded-xl flex items-center justify-center shadow-sm group relative transition-all duration-300 flex-shrink-0
                        ${isNewChatActive ? 'bg-gradient-to-r from-orange-500 to-pink-600' : 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600'} text-white 
                        ${sidebarCollapsed ? 'w-12 h-12 p-0 mx-auto mb-8' : 'w-full py-3 px-4 mb-8'}`}
            title={sidebarCollapsed ? 'New Chat' : undefined}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />

            {/* Smooth CSS Transition for Label */}
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap
                ${sidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-2'}
              `}
            >
              New Chat
            </span>

            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                New Chat
              </div>
            )}
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
                   ${sidebarCollapsed ? 'justify-center p-0 w-12 h-12 mx-auto' : 'gap-3 px-4 py-3 w-full'}
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
                title={sidebarCollapsed ? item.label : undefined}
              >
                {({ isActive }) => {
                  const actualIsActive = item.to === '/' ? (isActive && currentThreadId !== null) : isActive;
                  return (
                    <>
                      <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${actualIsActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />

                      {/* Smooth CSS Transition for Label */}
                      <span
                        className={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap
                        ${sidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 flex-1'}
                      `}
                      >
                        {item.label}
                      </span>

                      {/* Active Job Badge */}
                      {item.label === 'Chat' && activeJobCount > 0 && (
                        <div className={`
                      flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded-full
                      ${sidebarCollapsed ? 'absolute -top-1 -right-1 w-4 h-4' : 'px-2 py-0.5 ml-auto'}
                      animate-pulse shadow-sm
                    `}>
                          {sidebarCollapsed ? '' : `${activeJobCount} running`}
                        </div>
                      )}

                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
