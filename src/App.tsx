import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ChatPage from './pages/ChatPage';
import GalleryPage from './pages/GalleryPage';
import InspectorPage from './pages/InspectorPage';
import HistoryPage from './pages/HistoryPage';
import { useTheme } from './hooks/useTheme';
import TesterPage from './pages/TesterPage';

function App() {
  // Initialize theme - this will set light mode as default
  useTheme();

  // Ensure light mode is set on initial load - force it
  useEffect(() => {
    const root = document.documentElement;
    
    // Aggressive approach - force light mode
    root.classList.remove('dark');
    root.className = root.className.replace(/dark/g, ''); // Remove any dark classes
    
    // Also force body background
    document.body.style.backgroundColor = '#f9fafb';
    document.body.style.color = '#111827';
    
    // Clear any conflicting localStorage if theme is not explicitly set
    const currentTheme = localStorage.getItem('theme');
    if (!currentTheme || currentTheme !== 'light') {
      localStorage.setItem('theme', 'light');
    }
    
    console.log('App mounted - aggressively forced light mode, theme:', currentTheme);
    console.log('HTML classes:', root.className);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="inspector" element={<InspectorPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="tester" element={<TesterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
