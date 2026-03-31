import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ChatPage from './pages/ChatPage';
import GalleryPage from './pages/GalleryPage';
import InspectorPage from './pages/InspectorPage';
import HistoryPage from './pages/HistoryPage';
import { useTheme } from './hooks/useTheme';

// Dev-only pages — lazy loaded and only rendered in development
const DebugPage = React.lazy(() => import('./pages/DebugPage'));
const TesterPage = React.lazy(() => import('./pages/TesterPage'));

function App() {
  // Initialize theme from localStorage/system preference (dark mode fully supported)
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="inspector" element={<InspectorPage />} />
          <Route path="history" element={<HistoryPage />} />
          {/* Debug & Tester pages are only accessible in development builds */}
          {import.meta.env.DEV && (
            <>
              <Route path="tester" element={<Suspense fallback={null}><TesterPage /></Suspense>} />
              <Route path="debug" element={<Suspense fallback={null}><DebugPage /></Suspense>} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
