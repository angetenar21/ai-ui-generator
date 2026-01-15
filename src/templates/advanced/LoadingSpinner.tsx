import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  /** Size variant */
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  /** Color variant */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

  /** Spinner style/animation */
  variant?: 'spin' | 'pulse' | 'dots' | 'bars';

  /** Optional loading text */
  label?: string;

  /** Center in container */
  centered?: boolean;

  /** Full screen overlay */
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  variant = 'spin',
  label,
  centered = false,
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-text-secondary',
    accent: 'text-accent-cyan',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  const renderSpinner = () => {
    const spinnerSize = sizeClasses[size];
    const spinnerColor = colorClasses[color];

    switch (variant) {
      case 'pulse':
        return (
          <div className={`${spinnerSize} ${spinnerColor} animate-pulse`}>
            <RefreshCw className="w-full h-full" />
          </div>
        );

      case 'dots':
        return (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full ${spinnerColor} bg-current`}
                style={{
                  width: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px',
                  height: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px',
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className="flex gap-1 items-end">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 ${spinnerColor} bg-current rounded`}
                style={{
                  height: size === 'small' ? '12px' : size === 'medium' ? '20px' : '28px',
                  animation: `loading-bars 1s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        );

      case 'spin':
      default:
        return (
          <div className={`${spinnerSize} ${spinnerColor} animate-spin`}>
            <Loader2 className="w-full h-full" />
          </div>
        );
    }
  };

  const content = (
    <div
      className={`
        flex flex-col items-center gap-3
        ${centered ? 'justify-center min-h-[200px]' : ''}
      `}
    >
      {renderSpinner()}
      {label && (
        <div className="text-text-secondary text-sm font-medium">
          {label}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-main/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center p-6 my-2">
        {content}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 p-2">
      {content}
    </div>
  );
};

export default LoadingSpinner;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes loading-bars {
    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
    50% { transform: scaleY(1); opacity: 1; }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('loading-spinner-styles')) {
  style.id = 'loading-spinner-styles';
  document.head.appendChild(style);
}

export const metadata = {
  name: 'loading-spinner',
  category: 'advanced' as const,
  component: LoadingSpinner,
  description: 'Customizable loading spinner with multiple styles, sizes, and colors',
  tags: ['loading', 'spinner', 'loader', 'progress', 'waiting', 'animation'],
  propTypes: {
    size: 'string - Size: small, medium, large, xlarge (default: medium)',
    color: 'string - Color: primary, secondary, accent, success, warning, error (default: primary)',
    variant: 'string - Animation style: spin, pulse, dots, bars (default: spin)',
    label: 'string - Optional loading text to display',
    centered: 'boolean - Center in container (default: false)',
    fullScreen: 'boolean - Show as full-screen overlay (default: false)',
  },
};
