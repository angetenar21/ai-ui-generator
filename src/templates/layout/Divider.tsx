import React from 'react';

interface DividerProps {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical';

  /** Optional label text */
  label?: string;

  /** Label position */
  labelPosition?: 'left' | 'center' | 'right';

  /** Variant style */
  variant?: 'solid' | 'dashed' | 'dotted';

  /** Thickness */
  thickness?: 'thin' | 'medium' | 'thick';

  /** Spacing around the divider */
  spacing?: 'none' | 'small' | 'medium' | 'large';

  /** Color variant */
  color?: 'default' | 'primary' | 'secondary';
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  variant = 'solid',
  thickness = 'thin',
  spacing = 'medium',
  color = 'default',
}) => {
  const spacingClasses = {
    none: orientation === 'horizontal' ? 'my-0' : 'mx-0',
    small: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    medium: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    large: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  };

  const thicknessClasses = {
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1',
  };

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const colorClasses = {
    default: 'bg-border-primary border-border-primary',
    primary: 'bg-primary-500 border-primary-500',
    secondary: 'bg-accent-from border-accent-from',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`${thicknessClasses[thickness]} ${colorClasses[color]} ${spacingClasses[spacing]} self-stretch`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  // Horizontal divider with optional label
  if (label) {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <div
        className={`flex items-center ${alignClasses[labelPosition]} ${spacingClasses[spacing]} w-full`}
        role="separator"
      >
        {labelPosition !== 'left' && (
          <div
            className={`flex-1 ${thicknessClasses[thickness]} ${colorClasses[color]}`}
          />
        )}
        <span className="px-3 text-sm text-text-tertiary whitespace-nowrap">
          {label}
        </span>
        {labelPosition !== 'right' && (
          <div
            className={`flex-1 ${thicknessClasses[thickness]} ${colorClasses[color]}`}
          />
        )}
      </div>
    );
  }

  // Simple horizontal divider
  return (
    <div
      className={`w-full ${thicknessClasses[thickness]} ${colorClasses[color]} ${spacingClasses[spacing]} ${
        variant !== 'solid' ? `border-t ${variantClasses[variant]}` : ''
      }`}
      role="separator"
    />
  );
};

export default Divider;

export const metadata = {
  name: 'divider',
  category: 'layout' as const,
  component: Divider,
  description: 'Visual separator with optional label, supporting horizontal and vertical orientations with customizable styles.',
  tags: ['layout', 'divider', 'separator', 'hr'],
  propTypes: {
    orientation: '"horizontal" | "vertical"',
    label: 'string',
    labelPosition: '"left" | "center" | "right"',
    variant: '"solid" | "dashed" | "dotted"',
    thickness: '"thin" | "medium" | "thick"',
    spacing: '"none" | "small" | "medium" | "large"',
    color: '"default" | "primary" | "secondary"',
  },
};
