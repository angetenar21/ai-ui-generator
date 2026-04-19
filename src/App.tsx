import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AuthPage from './pages/AuthPage';
import AppLayout from './components/layout/AppLayout';
import { useTheme } from './hooks/useTheme';

// All pages are lazy-loaded — only downloaded when the user navigates to them.
// This cuts the initial JS payload from ~761KB to ~150-200KB gzipped.
const ChatPage     = React.lazy(() => import('./pages/ChatPage'));
const GalleryPage  = React.lazy(() => import('./pages/GalleryPage'));
const InspectorPage = React.lazy(() => import('./pages/InspectorPage'));
const HistoryPage  = React.lazy(() => import('./pages/HistoryPage'));
const DebugPage    = React.lazy(() => import('./pages/DebugPage'));
const TesterPage   = React.lazy(() => import('./pages/TesterPage'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-neutral-900 flex items-center justify-center fade-in">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Redirects away from /auth if the user is already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-neutral-900 flex items-center justify-center fade-in">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Lightweight page-level skeleton shown while lazy chunks download
const PageLoader = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

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
        <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Suspense fallback={<PageLoader />}><ChatPage /></Suspense>} />
          <Route path="gallery" element={<Suspense fallback={<PageLoader />}><GalleryPage /></Suspense>} />
          <Route path="inspector" element={<Suspense fallback={<PageLoader />}><InspectorPage /></Suspense>} />
          <Route path="history" element={<Suspense fallback={<PageLoader />}><HistoryPage /></Suspense>} />
          <Route path="tester" element={<Suspense fallback={null}><TesterPage /></Suspense>} />
          <Route path="debug" element={<Suspense fallback={null}><DebugPage /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
