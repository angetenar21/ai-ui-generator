import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  type?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant,
  type,
  width,
  height,
  count = 1,
  lines,
  animation = 'pulse',
  className = '',
}) => {
  const skeletonType = variant || type || 'text';
  const lineCount = lines || count;

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.5s_ease-in-out_infinite]',
    none: '',
  };

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const getWidthClass = () => {
    if (width) {
      return typeof width === 'number' ? `w-${width}` : '';
    }
    return 'w-full';
  };

  const getHeightClass = () => {
    if (height) {
      return typeof height === 'number' ? `h-${height}` : '';
    }
    if (skeletonType === 'circular') return 'w-12 h-12';
    return '';
  };

  const getInlineStyles = () => {
    const styles: React.CSSProperties = {};
    if (typeof width === 'string') styles.width = width;
    if (typeof height === 'string') styles.height = height;
    return styles;
  };

  if (skeletonType === 'text' && lineCount > 1) {
    return (
      <div className="card rounded-card p-6 my-4 space-y-3">
        {Array.from({ length: lineCount }).map((_, index) => (
          <div
            key={index}
            className={`
              ${variantClasses[skeletonType]}
              ${animationClasses[animation]}
              ${index === lineCount - 1 ? 'w-4/5' : 'w-full'}
              h-4 bg-gray-700
              ${className}
            `}
          />
        ))}
        <style>{`
          @keyframes wave {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="card rounded-card p-6 my-4">
      <div
        className={`
          ${variantClasses[skeletonType]}
          ${animationClasses[animation]}
          ${getWidthClass()}
          ${getHeightClass()}
          bg-gray-700
          ${className}
        `}
        style={getInlineStyles()}
      />
      <style>{`
        @keyframes wave {
          0% {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200% 100%;
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;

export const metadata = {
  name: 'skeleton',
  category: 'feedback' as const,
  component: Skeleton,
  description: 'Loading skeleton component for content placeholders. Supports text, circular, rectangular, and rounded variants with pulse and wave animations.',
  tags: ['ui', 'feedback', 'loading', 'skeleton', 'placeholder', 'shimmer'],
};
