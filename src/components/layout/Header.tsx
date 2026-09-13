import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import ThemeToggle from '../ThemeToggle';
import UserProfile from '../UserProfile';
import ApiService from '../../services/apiService';
import { motion } from 'framer-motion';

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
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 px-3 sm:px-4 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 flex-shrink-0 transition-colors duration-300"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 dark:hover:bg-gray-700/50 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <Link to="/" className="flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95" title="Go Home">
          <img
            src="/doc-e-logo.png"
            alt="Doc-E.ai"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Connection Status */}
        <div className={`group flex items-center gap-0 hover:gap-2 px-2 hover:px-3 py-1.5 rounded-full transition-all duration-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}>
          <span className={`w-2 h-2 rounded-full ${getStatusDot()}`}></span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile */}
        <UserProfile />
      </div>
    </motion.header>
  );
};

export default Header;
