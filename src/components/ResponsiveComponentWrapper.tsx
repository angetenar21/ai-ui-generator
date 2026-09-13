import React from 'react';
import type { ComponentSpec } from '../templates/core/types';

interface ResponsiveComponentWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
  alignLeft?: boolean;
  /** Pass the root ComponentSpec so we can skip the glass shell when the
   *  root component already has its own visual chrome (border / surface). */
  spec?: ComponentSpec;
}

/**
 * Components that carry their own visual chrome (border + surface).
 * When the root generated component is one of these, the glass wrapper
 * shell is suppressed to avoid a "double border" — the component's own
 * border IS the frame.
 *
 * Everything else (stack, grid, flexbox, data-table, etc.) has no chrome
 * of its own and benefits from the glass shell to provide visual unity.
 */
const CHROME_ROOTS = new Set([
  'panel',
  'summary-card',
  'music-player',
  'kanban',
  'modal',
  'drawer',
  'app-bar',
  'sidebar',
  'bottom-navigation',
  'tabs',
  'stepper',
  'section',           // usually has its own padding/bg
  'container',         // structural wrapper, no need for extra shell
]);

const ResponsiveComponentWrapper: React.FC<ResponsiveComponentWrapperProps> = ({
  children,
  maxWidth,
  alignLeft = false,
  spec, // Accept but ignore spec since we're removing the chrome logic
}) => {
  return (
    <div
      className={`w-full relative ${alignLeft ? 'flex justify-start' : ''}`}
      style={maxWidth ? { maxWidth: `${maxWidth}px`, margin: '0 auto' } : undefined}
    >
      <div
        className={`w-full relative ${alignLeft ? '[&>*:first-child]:!ml-0 [&>*:first-child]:!mr-auto' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveComponentWrapper;