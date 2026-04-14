import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className = '',
  animate = true,
}) => {
  const baseClasses = 'bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50';
  const animationClass = animate ? 'animate-pulse' : '';

  const variantClasses = {
    text: 'rounded h-4 w-full mb-2',
    rect: 'rounded-xl w-full',
    circle: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
    animationDuration: animate ? '0.75s' : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${animationClass} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;

/**
 * Pre-baked Dashboard Skeleton to mimic AI output structure
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-fade-in py-2">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-2">
          <Skeleton variant="text" width={200} height={24} />
          <Skeleton variant="text" width={140} height={12} />
        </div>
        <Skeleton variant="circle" width={32} height={32} />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton variant="rect" width={32} height={32} className="rounded-lg" />
              <Skeleton variant="text" width={48} height={10} />
            </div>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={10} />
          </div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4 space-y-4">
          <Skeleton variant="text" width={160} height={20} />
          <div className="h-48 flex items-end justify-between gap-3 px-2 pt-2">
            {[60, 80, 45, 90, 30, 75, 50, 85].map((h, i) => (
              <Skeleton
                key={i}
                variant="rect"
                height={`${h}%`}
                className="flex-1 opacity-60"
              />
            ))}
          </div>
        </div>

        <div className="card p-4 space-y-4">
          <Skeleton variant="text" width={120} height={20} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton variant="circle" width={28} height={28} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="80%" height={10} />
                <Skeleton variant="text" width="40%" height={8} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in py-4 card p-6">
      <Skeleton variant="text" width="60%" height={28} className="mb-6" />
      
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width={120} height={14} />
          <Skeleton variant="rect" height={40} className="rounded-lg" />
        </div>
      ))}
      <div className="pt-4 flex justify-end">
        <Skeleton variant="rect" width={120} height={40} className="rounded-lg" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-fade-in py-4 card p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2 w-1/2">
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="50%" height={14} />
        </div>
        <Skeleton variant="rect" width={100} height={32} className="rounded-lg" />
      </div>
      
      <div className="h-64 flex items-end justify-between gap-4 px-2">
        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
          <Skeleton
            key={i}
            variant="rect"
            height={`${h}%`}
            className="flex-1 opacity-80"
          />
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton variant="circle" width={12} height={12} />
            <Skeleton variant="text" width={60} height={12} className="mb-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const getDynamicSkeleton = (prompt: string) => {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('form') || lowercasePrompt.includes('login') || lowercasePrompt.includes('signup') || lowercasePrompt.includes('input')) {
    return <FormSkeleton />;
  }
  
  if (lowercasePrompt.includes('chart') || lowercasePrompt.includes('graph') || lowercasePrompt.includes('plot') || lowercasePrompt.includes('analytics')) {
    return <ChartSkeleton />;
  }
  
  return <DashboardSkeleton />;
};
