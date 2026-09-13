import React from 'react';

interface Step {
  /** Label for the step */
  label: string;

  /** Description for the step */
  description?: string;

  /** Icon for the step */
  icon?: string;

  /** Step status */
  status?: 'pending' | 'active' | 'completed' | 'error';
}

interface StepperProps {
  /** Array of steps */
  steps?: Step[];

  /** Current active step index */
  activeStep?: number;

  /** Orientation */
  orientation?: 'horizontal' | 'vertical';

  /** Show step numbers */
  showNumbers?: boolean;

  /** Variant style */
  variant?: 'default' | 'outlined' | 'simple';

  /** Size */
  size?: 'small' | 'medium' | 'large';

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Stepper: React.FC<StepperProps> = ({
  steps = [],
  activeStep = 0,
  orientation = 'horizontal',
  showNumbers = true,
  variant = 'default',
  size = 'medium',
}) => {
  const sizeClasses = {
    small: {
      text: 'text-xs',
      icon: 'w-7 h-7 text-xs',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
    medium: {
      text: 'text-sm',
      icon: 'w-10 h-10 text-sm',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
    large: {
      text: 'text-base',
      icon: 'w-12 h-12 text-base',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
  };

  const safeSteps = Array.isArray(steps) ? steps : [];

  if (safeSteps.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Stepper - Add steps to display</p>
      </div>
    );
  }

  const getStepStatus = (index: number, step: Step) => {
    if (step.status) return step.status;
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'active';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-orange-500 text-white border-orange-500 shadow-sm';
      case 'active':
        return 'bg-orange-500 text-white border-orange-500 ring-4 ring-orange-500/20';
      case 'error':
        return 'bg-red-500 text-white border-red-500 ring-4 ring-red-500/20';
      default:
        return 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-600';
    }
  };

  const getConnectorColor = (index: number) => {
    return index < activeStep
      ? 'bg-orange-500'
      : 'bg-zinc-200 dark:bg-zinc-700';
  };

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-2 ${sizeClasses[size].text}`}>
        {safeSteps.map((step, index) => {
          const status = getStepStatus(index, step);
          const isLast = index === safeSteps.length - 1;

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`${sizeClasses[size].icon} rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ease-out ${getStepColor(status)}`}
                >
                  {status === 'completed' && !step.icon ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : (step.icon || (showNumbers && index + 1))}
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 ${sizeClasses[size].connector} min-h-8 ${getConnectorColor(index)} transition-colors duration-300`}
                  />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="font-display font-bold tracking-tight text-zinc-900 dark:text-white">{step.label}</div>
                {step.description && (
                  <div className="text-zinc-600 dark:text-zinc-300 mt-1">{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`flex items-center ${sizeClasses[size].text}`}>
      {safeSteps.map((step, index) => {
        const status = getStepStatus(index, step);
        const isLast = index === safeSteps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`${sizeClasses[size].icon} rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ease-out ${getStepColor(status)}`}
              >
                {status === 'completed' && !step.icon ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (step.icon || (showNumbers && index + 1))}
              </div>
              <div className="text-center max-w-24">
                <div className="font-display font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                  {step.label}
                </div>
                {step.description && variant !== 'simple' && (
                  <div className="text-zinc-600 dark:text-zinc-400 text-xs mt-1 truncate">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 min-w-8 mx-2 ${getConnectorColor(index)} transition-colors duration-300`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;

export const metadata = {
  name: 'stepper',
  category: 'layout' as const,
  component: Stepper,
  description: 'Step-by-step progress indicator showing workflow stages, supporting both horizontal and vertical orientations.',
  tags: ['layout', 'stepper', 'progress', 'wizard', 'navigation'],
  propTypes: {
    steps: 'Step[]',
    activeStep: 'number',
    orientation: '"horizontal" | "vertical"',
    showNumbers: 'boolean',
    variant: '"default" | "outlined" | "simple"',
    size: '"small" | "medium" | "large"',
  },
};
