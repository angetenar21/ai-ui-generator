import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Grid3x3, Code, History, FlaskConical, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, clearGeneratedComponents, setCurrentThreadId, triggerNewChat } = useAppStore();

  const navItems = [
    { to: '/', icon: MessageSquare, label: 'Chat' },
    { to: '/gallery', icon: Grid3x3, label: 'Gallery' },
    { to: '/inspector', icon: Code, label: 'Inspector' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/tester', icon: FlaskConical, label: 'Tester' },
  ];

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
        className={`fixed lg:static top-0 left-0 h-full card-elevated
                   transform transition-all duration-300 z-30 rounded-card m-5 p-5
                   flex flex-col
                   ${sidebarCollapsed ? 'w-20' : 'w-64'}
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Collapse/Expand Button - Desktop Only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full
                     bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-600/30
                     items-center justify-center
                     hover:bg-white/20 dark:hover:bg-gray-700/50 hover:scale-110
                     active:scale-95
                     transition-all duration-200
                     text-gray-700 dark:text-gray-300 shadow-lg z-40"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className={`flex items-center mb-6 px-2 transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            ✦
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-display font-bold text-gray-900 dark:text-white whitespace-nowrap" style={{ color: '#111827' }}>
              AI Workshop
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                 hover:translate-x-1 group relative
                 ${sidebarCollapsed ? 'justify-center' : ''}
                 ${
                   isActive
                     ? 'bg-orange-500 text-white'
                     : 'text-gray-900 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                 }`
              }
              onClick={() => {
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className={`w-full gradient-primary text-white font-semibold px-4 py-3 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform mb-4 shadow-md group relative
                      ${sidebarCollapsed ? 'justify-center' : 'justify-center'}`}
          title={sidebarCollapsed ? 'New Chat' : undefined}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>New Chat</span>}
          
          {/* Tooltip for collapsed state */}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              New Chat
            </div>
          )}
        </button>

        {/* Footer */}
        {!sidebarCollapsed && (
            <div className="text-xs text-gray-700 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>n8n AI</span>
              </div>
            </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
