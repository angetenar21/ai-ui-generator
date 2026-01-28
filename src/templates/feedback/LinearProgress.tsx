import React from 'react';

interface LinearProgressProps {
  value?: number;
  percentage?: number;
  progress?: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  label?: string;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
}

const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  percentage,
  progress,
  max = 100,
  color,
  variant,
  size = 'medium',
  showValue = true,
  label,
  indeterminate = false,
  striped = false,
  animated = false,
}) => {
  const progressValue = value ?? percentage ?? progress ?? 0;
  const normalizedValue = max > 0 ? (progressValue / max) * 100 : 0;
  const clampedValue = Math.min(100, Math.max(0, normalizedValue));
  const progressColor = color || variant || 'primary';

  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  } as const;

  const colorClasses = {
    primary: 'bg-orange-600 dark:bg-orange-500',
    secondary: 'bg-gray-500 dark:bg-gray-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-amber-600 dark:bg-amber-500',
    error: 'bg-red-600 dark:bg-red-500',
  } as const;

  const animationClass = indeterminate
    ? 'animate-[slide_1.2s_ease-in-out_infinite]'
    : animated
      ? 'transition-[width] duration-300 ease-out'
      : '';

  const stripedClass = striped
    ? 'bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:30px_100%] bg-[position:0_0]'
    : '';

  const valueLabel = showValue && !indeterminate ? `${Math.round(clampedValue)}%` : undefined;

  return (
    <div
      className="card rounded-card p-6 my-4"
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="w-full">
        {(label || valueLabel) && (
          <div className="flex justify-between items-center mb-2">
            {label ? <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span> : <span />}
            {valueLabel && <span className="text-sm text-gray-600 dark:text-gray-400">{valueLabel}</span>}
          </div>
        )}
        <div className={`w-full ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
          <div
            className={`
              ${sizeClasses[size]}
              ${colorClasses[progressColor]}
              ${indeterminate ? 'w-1/3' : ''}
              ${stripedClass}
              ${animationClass}
              rounded-full
            `}
            style={{
              width: indeterminate ? '35%' : `${clampedValue}%`,
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes slide {
          0% { margin-left: -33.33%; }
          50% { margin-left: 100%; }
          100% { margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LinearProgress;

export const metadata = {
  name: 'linear-progress',
  category: 'feedback' as const,
  component: LinearProgress,
  description: 'Linear progress bar with customizable colors, sizes, and animations. Supports determinate, indeterminate, striped, and animated variants.',
  tags: ['ui', 'feedback', 'progress', 'loading', 'bar', 'linear'],
};
