import React, { useState, useEffect } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import ThemeToggle from '../ThemeToggle';
import ApiService from '../../services/apiService';

const Header: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Health check function using backend /health endpoint
  const checkHealth = async () => {
    try {
      const health = await ApiService.getHealthStatus();

      // Connected if status is 'ok' or 'degraded'
      if (health.status === 'ok' || health.status === 'degraded') {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  // Check health every 30 seconds
  useEffect(() => {
    checkHealth(); // Initial check
    const interval = setInterval(checkHealth, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);


  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const getStatusDot = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-emerald-400 animate-pulse';
      case 'disconnected':
        return 'bg-red-400';
      case 'checking':
        return 'bg-yellow-400 animate-pulse';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <header className="glass-light backdrop-blur-md mx-5 mt-5 mb-0 rounded-xl px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">
            AI UI Generator
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className={`group flex items-center gap-0 hover:gap-2 px-2 hover:px-3 py-1.5 rounded-full transition-all duration-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}>
          <span className={`w-2 h-2 rounded-full ${getStatusDot()}`}></span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
