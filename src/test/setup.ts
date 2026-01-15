import '@testing-library/jest-dom';

// Import templates to trigger component registration
import '../templates/index';

// Global test setup
import { beforeAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup before all tests
beforeAll(() => {
  // Mock console to reduce noise in tests
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});