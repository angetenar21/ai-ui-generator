import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Chat',
  '/auth': 'Sign In',
  '/gallery': 'Template Gallery',
  '/inspector': 'Inspector',
  '/history': 'History',
  '/tester': 'Tester',
  '/debug': 'Debug',
};

const APP_NAME = 'AI UI-UX Generator';

/**
 * Hook that dynamically updates the browser tab title based on the current route.
 * Falls back to just the app name for unknown routes.
 */
export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname];
    document.title = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME;
  }, [location.pathname]);
}
