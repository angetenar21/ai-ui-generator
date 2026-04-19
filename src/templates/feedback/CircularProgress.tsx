import React from 'react';

interface CircularProgressProps {
  value?: number;
  percentage?: number;
  progress?: number;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  thickness?: number;
  showValue?: boolean;
  label?: string;
  indeterminate?: boolean;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  percentage,
  progress,
  size = 'medium',
  color,
  variant,
  thickness = 4,
  showValue = true,
  label,
  indeterminate = false,
}) => {
  const rawValue = value ?? percentage ?? progress ?? 0;
  const numericValue = typeof rawValue === 'number' 
    ? rawValue 
    : parseFloat(String(rawValue).replace(/[^0-9.-]+/g, "")) || 0;
  const clampedValue = Math.min(100, Math.max(0, numericValue));
  const progressColor = color || variant || 'primary';
  const strokeWidth = thickness < 5 ? 6 : thickness;

  const sizeClasses = {
    small: { circle: 'w-16 h-16', text: 'text-xs' },
    medium: { circle: 'w-24 h-24', text: 'text-sm' },
    large: { circle: 'w-32 h-32', text: 'text-base' },
  };

  const colorClasses = {
    primary: 'text-orange-600 dark:text-orange-500',
    secondary: 'text-zinc-500 dark:text-zinc-500',
    success: 'text-green-600 dark:text-green-500',
    warning: 'text-orange-600 dark:text-orange-500',
    error: 'text-red-600 dark:text-red-500',
  };

  const sizeConfig = sizeClasses[size];
  const viewBoxSize = 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className="card rounded-2xl p-6 my-4"
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`relative ${sizeConfig.circle}`}>
          <svg className="transform -rotate-90 w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-zinc-200 dark:text-zinc-700"
            />
            {/* Progress circle */}
            {!indeterminate ? (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={`${colorClasses[progressColor]} transition-all duration-500 ease-out`}
              />
            ) : (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeLinecap="round"
                className={`${colorClasses[progressColor]} animate-spin`}
                style={{ strokeDashoffset: circumference * 0.75 }}
              />
            )}
          </svg>
          {/* Center text */}
          {showValue && !indeterminate && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-display font-bold text-zinc-900 dark:text-zinc-100 ${sizeConfig.text}`}>
                {Math.round(clampedValue)}%
              </span>
            </div>
          )}
        </div>
        {label && (
          <div className="text-sm text-zinc-600 dark:text-zinc-300 text-center font-medium">{label}</div>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;

export const metadata = {
  name: 'circular-progress',
  category: 'feedback' as const,
  component: CircularProgress,
  description: 'Circular progress indicator with customizable size, color, and value display. Supports determinate and indeterminate modes.',
  tags: ['ui', 'feedback', 'progress', 'loading', 'spinner', 'circular'],
};
