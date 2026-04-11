import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AuthPage from './pages/AuthPage';
import AppLayout from './components/layout/AppLayout';
import ChatPage from './pages/ChatPage';
import GalleryPage from './pages/GalleryPage';
import InspectorPage from './pages/InspectorPage';
import HistoryPage from './pages/HistoryPage';
import { useTheme } from './hooks/useTheme';

// Dev-only pages — lazy loaded and only rendered in development
const DebugPage = React.lazy(() => import('./pages/DebugPage'));
const TesterPage = React.lazy(() => import('./pages/TesterPage'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-neutral-900 flex items-center justify-center fade-in">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Initialize theme from localStorage/system preference (dark mode fully supported)
  useTheme();
  
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<ChatPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="inspector" element={<InspectorPage />} />
          <Route path="history" element={<HistoryPage />} />
          {/* Debug & Tester pages are now accessible in production to allow testing on VM */}
          <Route path="tester" element={<Suspense fallback={null}><TesterPage /></Suspense>} />
          <Route path="debug" element={<Suspense fallback={null}><DebugPage /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
