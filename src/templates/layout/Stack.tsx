import React from 'react';
import type { ComponentSpec } from '../core/types';

interface StackProps {
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';

  /** Spacing between items */
  spacing?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';

  /** Alignment of items along the cross axis */
  align?: 'start' | 'center' | 'end' | 'stretch';

  /** Justification of items along the main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

  /** Wrap items to next line */
  wrap?: boolean;

  /** Divider between items */
  divider?: boolean;

  /** Full width */
  fullWidth?: boolean;

  /** Child components */
  children?: ComponentSpec[];

  /** Function to render child components */
  renderChild?: (child: ComponentSpec) => React.ReactNode;
}

const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'medium',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  divider = false,
  fullWidth = false,
  children,
  renderChild,
}) => {
  const spacingClasses = {
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
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row';
  const wrapClass = wrap ? 'flex-wrap' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  // Get divider classes based on direction
  const getDividerClasses = () => {
    if (direction === 'vertical') {
      return 'h-[2px] w-full bg-gray-200 dark:bg-gray-700 my-1';
    }
    return 'w-[2px] self-stretch bg-gray-200 dark:bg-gray-700 mx-1';
  };

  // Get child wrapper classes
  const getChildWrapperClasses = () => {
    const classes = ['min-w-0', 'flex-shrink-0'];
    if (fullWidth) {
      classes.push('w-full');
    }
    if (direction === 'horizontal' && !fullWidth) {
      classes.push('flex-1');
    }
    return classes.join(' ');
  };

  return (
    <div
      className={`flex ${directionClass} ${spacingClasses[spacing]} ${alignClasses[align]} ${justifyClasses[justify]} ${wrapClass} ${widthClass}`}
    >
      {children && children.length > 0 && renderChild ? (
        children.map((child, index) => (
          <React.Fragment key={index}>
            <div className={getChildWrapperClasses()}>
              {renderChild(child)}
            </div>
            {divider && index < children.length - 1 && (
              <div className={getDividerClasses()} />
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="card rounded-card p-8 text-center w-full">
          <p className="text-gray-500 dark:text-gray-400">
            Stack layout ({direction}) - Add child components
          </p>
        </div>
      )}
    </div>
  );
};

export default Stack;

export const metadata = {
  name: 'stack',
  category: 'layout' as const,
  component: Stack,
  description: 'Vertical or horizontal stacking layout with configurable spacing, alignment, and optional dividers between items.',
  tags: ['layout', 'stack', 'flex', 'container'],
  propTypes: {
    direction: '"vertical" | "horizontal"',
    spacing: '"none" | "small" | "medium" | "large" | "xlarge"',
    align: '"start" | "center" | "end" | "stretch"',
    justify: '"start" | "center" | "end" | "between" | "around" | "evenly"',
    wrap: 'boolean',
    divider: 'boolean',
    fullWidth: 'boolean',
    children: 'ComponentSpec[]',
  },
};
