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
  };

  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className="card rounded-card p-6 my-4">
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">{label}</span>
            {showValue && !indeterminate && (
              <span className="text-sm text-gray-400">{Math.round(clampedValue)}%</span>
            )}
          </div>
        )}
        <div className={`w-full ${sizeClasses[size]} bg-gray-700 rounded-full overflow-hidden`}>
          <div
            className={`
              ${sizeClasses[size]}
              ${colorClasses[progressColor]}
              ${indeterminate ? 'w-1/3 animate-pulse' : ''}
              ${striped ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:30px_100%]' : ''}
              ${animated ? 'transition-all duration-300 ease-out' : ''}
              ${indeterminate ? 'animate-[slide_1.5s_ease-in-out_infinite]' : ''}
              rounded-full
            `}
            style={{
              width: indeterminate ? undefined : `${clampedValue}%`,
              animation: indeterminate ? 'slide 1.5s ease-in-out infinite' : undefined,
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
