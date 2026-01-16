import React from 'react';
import type { ComponentSpec } from '../core/types';

interface GridProps {
  /** Number of columns in the grid */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;

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
  minColumnWidth = '250px',
  children,
  renderChild,
}) => {
  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2',
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

    if (!responsive) {
      return `grid-cols-${columns}`;
    }

    // Responsive grid classes
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
      case 6:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
      case 12:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const gridStyle = autoFit
    ? {
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`,
      }
    : undefined;

  return (
    <div
      className={`grid w-full ${getColumnClasses()} ${gapClasses[gap]} ${alignClasses[alignItems]} ${justifyClasses[justifyItems]}`}
      style={gridStyle}
    >
      {children && children.length > 0 && renderChild ? (
        children.map((child, index) => (
          <div key={index} className="min-w-0 w-full h-full flex flex-col">
            {renderChild(child)}
          </div>
        ))
      ) : (
        <div className="col-span-full bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Grid layout ({columns} columns) - Add child components
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
