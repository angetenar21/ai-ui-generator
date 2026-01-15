import React from 'react';
import type { ComponentSpec } from '../core/types';

interface FlexboxProps {
  /** Flex direction */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';

  /** Justify content */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

  /** Align items */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';

  /** Gap between items */
  gap?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';

  /** Wrap items */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /** Full width */
  fullWidth?: boolean;

  /** Full height */
  fullHeight?: boolean;

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Flexbox: React.FC<FlexboxProps> = ({
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 'medium',
  wrap = 'nowrap',
  fullWidth = false,
  fullHeight = false,
  children,
  renderChild,
}) => {
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    xlarge: 'gap-8',
  };

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const heightClass = fullHeight ? 'h-full' : '';

  return (
    <div
      className={`flex ${directionClasses[direction]} ${justifyClasses[justify]} ${alignClasses[align]} ${gapClasses[gap]} ${wrapClasses[wrap]} ${widthClass} ${heightClass}`}
    >
      {children && children.length > 0 && renderChild ? (
        children.map((child, index) => (
          <div key={index}>{renderChild(child)}</div>
        ))
      ) : (
        <div className="card rounded-card p-8 text-center flex-1">
          <p className="text-text-tertiary">
            Flexbox ({direction}) - Add child components
          </p>
        </div>
      )}
    </div>
  );
};

export default Flexbox;

export const metadata = {
  name: 'flexbox',
  category: 'layout' as const,
  component: Flexbox,
  description: 'Flexible box layout with full control over direction, justify, align, gap, and wrap properties.',
  tags: ['layout', 'flex', 'flexbox', 'responsive'],
  propTypes: {
    direction: '"row" | "row-reverse" | "column" | "column-reverse"',
    justify: '"start" | "end" | "center" | "between" | "around" | "evenly"',
    align: '"start" | "end" | "center" | "baseline" | "stretch"',
    gap: '"none" | "small" | "medium" | "large" | "xlarge"',
    wrap: '"nowrap" | "wrap" | "wrap-reverse"',
    fullWidth: 'boolean',
    fullHeight: 'boolean',
    children: 'ComponentSpec[]',
  },
};
