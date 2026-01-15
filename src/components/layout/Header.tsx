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

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400';
      case 'disconnected':
        return 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400';
      case 'checking':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-400';
    }
  };

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
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm transition-colors ${getStatusColor()}`}>
          <span className={`w-2 h-2 rounded-full ${getStatusDot()}`}></span>
          <span className="font-medium">{getStatusText()}</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
