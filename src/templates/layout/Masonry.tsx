import React from 'react';
import type { ComponentSpec } from '../core/types';

interface MasonryProps {
  /** Number of columns */
  columns?: 2 | 3 | 4 | 5 | 6;

  /** Gap between items */
  gap?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';

  /** Responsive behavior */
  responsive?: boolean;

  /** Breakpoint configuration for responsive columns */
  breakAt?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Masonry: React.FC<MasonryProps> = ({
  columns = 3,
  gap = 'medium',
  responsive = true,
  breakAt,
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

  // Distribute children into columns
  const distributeToColumns = (items: ComponentSpec[], numColumns: number) => {
    const safeCols = Math.max(1, parseInt(String(numColumns), 10) || 1);
    const cols: ComponentSpec[][] = Array.from({ length: safeCols }, () => []);
    items.forEach((item, index) => {
      const colIndex = index % safeCols;
      if (cols[colIndex]) {
         cols[colIndex].push(item);
      }
    });
    return cols;
  };

  if (!children || children.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          Masonry layout ({columns} columns) - Add child components
        </p>
      </div>
    );
  }

  const columnData = distributeToColumns(children, columns);

  // Build responsive column classes
  const getColumnClasses = () => {
    if (!responsive) {
      const colsMap: Record<number, string> = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
      };
      return colsMap[columns] || 'grid-cols-3';
    }

    if (breakAt) {
      const colMap: Record<number, string> = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' };
      const classes: string[] = [];
      if (breakAt.default && colMap[breakAt.default]) classes.push(`grid-cols-${colMap[breakAt.default]}`);
      if (breakAt.sm && colMap[breakAt.sm]) classes.push(`sm:grid-cols-${colMap[breakAt.sm]}`);
      if (breakAt.md && colMap[breakAt.md]) classes.push(`md:grid-cols-${colMap[breakAt.md]}`);
      if (breakAt.lg && colMap[breakAt.lg]) classes.push(`lg:grid-cols-${colMap[breakAt.lg]}`);
      if (breakAt.xl && colMap[breakAt.xl]) classes.push(`xl:grid-cols-${colMap[breakAt.xl]}`);
      return classes.join(' ');
    }

    // Default responsive behavior
    switch (columns) {
      case 2:
        return 'grid-cols-1 lg:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
      case 6:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6';
      default:
        return 'grid-cols-1 lg:grid-cols-2';
    }
  };

  return (
    <div className={`grid ${getColumnClasses()} ${gapClasses[gap]}`}>
      {columnData.map((column, columnIndex) => (
        <div key={columnIndex} className={`flex flex-col ${gapClasses[gap]}`}>
          {column.map((child, itemIndex) => (
            <div key={itemIndex} className="break-inside-avoid">
              {renderChild && renderChild(child)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Masonry;

export const metadata = {
  name: 'masonry',
  category: 'layout' as const,
  component: Masonry,
  description: 'Masonry grid layout that distributes items across columns with dynamic heights, perfect for image galleries and card layouts.',
  tags: ['layout', 'masonry', 'grid', 'gallery', 'responsive'],
  propTypes: {
    columns: '2 | 3 | 4 | 5 | 6',
    gap: '"none" | "small" | "medium" | "large" | "xlarge"',
    responsive: 'boolean',
    breakAt: '{ default?: number; sm?: number; md?: number; lg?: number; xl?: number }',
    children: 'ComponentSpec[]',
  },
};
