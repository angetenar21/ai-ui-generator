import React from 'react';
import type { ComponentSpec } from '../core/types';

interface GridProps {
  /** Number of columns in the grid (number or object for responsive) */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | Record<string, number>;

  /** Gap between grid items */
  gap?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';

  /** Responsive behavior */
  responsive?: boolean;

  /** Alignment of items */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';

  /** Justify content */
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';

  /** Auto-fit columns (responsive) */
  autoFit?: boolean;

  /** Minimum column width for auto-fit */
  minColumnWidth?: string;

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Grid: React.FC<GridProps> = ({
  columns = 2,
  gap = 'medium',
  responsive = true,
  alignItems = 'stretch',
  justifyItems = 'stretch',
  autoFit = false,
  minColumnWidth = '180px',
  children,
  renderChild,
}) => {
  const gapClasses = {
    none: 'gap-0',
    small: 'gap-3',
    medium: 'gap-4',
    large: 'gap-6',
    xlarge: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-items-start',
    center: 'justify-items-center',
    end: 'justify-items-end',
    stretch: 'justify-items-stretch',
  };

  const getColumnClasses = () => {
    if (autoFit) {
      return ''; // Will use inline style for auto-fit
    }

    // Handle responsive object format: { xs: 1, sm: 2, md: 3, ... }
    if (typeof columns === 'object' && columns !== null) {
      const classes: string[] = [];
      const colsObj = columns as Record<string, number>;

      // Default to 1 column if xs/default not specified
      if (!colsObj.xs) classes.push('grid-cols-1');

      Object.entries(colsObj).forEach(([bp, cols]) => {
        const prefix = bp === 'xs' ? '' : `${bp}:`;
        classes.push(`${prefix}grid-cols-${cols}`);
      });

      return classes.join(' ');
    }

    if (!responsive) {
      const colsMap: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      };
      return colsMap[columns] || 'grid-cols-2';
    }

    // specific responsive behaviors for single number inputs
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 5: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
      case 6: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      case 12: return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const gridStyle = autoFit
    ? {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
    }
    : undefined;

  return (
    <div
      className={`grid w-full max-w-full ${getColumnClasses()} ${gapClasses[gap]} ${alignClasses[alignItems]} ${justifyClasses[justifyItems]}`}
      style={gridStyle}
    >
      {Array.isArray(children) && children.length > 0 && renderChild ? (
        children.map((child, index) => (
          <div key={index} className="min-w-0 w-full h-full flex flex-col">
            {renderChild(child)}
          </div>
        ))
      ) : (
        <div className="col-span-full bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Grid layout ({typeof columns === 'object' ? 'responsive' : `${columns} columns`}) - Add child components
          </p>
        </div>
      )}
    </div>
  );
};

export default Grid;

export const metadata = {
  name: 'grid',
  category: 'layout' as const,
  component: Grid,
  description: 'Responsive grid system with configurable columns, gap, and alignment. Supports auto-fit for dynamic column sizing.',
  tags: ['layout', 'grid', 'responsive', 'container'],
  propTypes: {
    columns: '1 | 2 | 3 | 4 | 5 | 6 | 12',
    gap: '"none" | "small" | "medium" | "large" | "xlarge"',
    responsive: 'boolean',
    alignItems: '"start" | "center" | "end" | "stretch"',
    justifyItems: '"start" | "center" | "end" | "stretch"',
    autoFit: 'boolean',
    minColumnWidth: 'string',
    children: 'ComponentSpec[]',
  },
};
