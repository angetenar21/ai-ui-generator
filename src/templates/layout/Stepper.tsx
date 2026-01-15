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
      icon: 'w-6 h-6 text-xs',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
    medium: {
      text: 'text-sm',
      icon: 'w-8 h-8 text-sm',
      connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    },
    large: {
      text: 'text-base',
      icon: 'w-10 h-10 text-base',
      connector: orientation === 'horizontal' ? 'h-1' : 'w-1',
    },
  };

  if (steps.length === 0) {
    return (
      <div className="card rounded-card p-8 text-center">
        <p className="text-text-tertiary">Stepper - Add steps to display</p>
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
        return 'bg-primary-500 text-white border-primary-500';
      case 'active':
        return 'bg-accent-from text-white border-accent-from';
      case 'error':
        return 'bg-red-500 text-white border-red-500';
      default:
        return 'bg-bg-surface text-text-tertiary border-border-primary';
    }
  };

  const getConnectorColor = (index: number) => {
    return index < activeStep
      ? 'bg-primary-500'
      : 'bg-border-primary';
  };

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-2 ${sizeClasses[size].text}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index, step);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`${sizeClasses[size].icon} rounded-full border-2 flex items-center justify-center font-semibold ${getStepColor(status)}`}
                >
                  {step.icon || (showNumbers && index + 1)}
                  {status === 'completed' && !step.icon && '✓'}
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 ${sizeClasses[size].connector} min-h-8 ${getConnectorColor(index)}`}
                  />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="font-semibold text-text-primary">{step.label}</div>
                {step.description && (
                  <div className="text-text-secondary mt-1">{step.description}</div>
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
      {steps.map((step, index) => {
        const status = getStepStatus(index, step);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`${sizeClasses[size].icon} rounded-full border-2 flex items-center justify-center font-semibold ${getStepColor(status)}`}
              >
                {step.icon || (showNumbers && index + 1)}
                {status === 'completed' && !step.icon && '✓'}
              </div>
              <div className="text-center max-w-24">
                <div className="font-semibold text-text-primary truncate">
                  {step.label}
                </div>
                {step.description && variant !== 'simple' && (
                  <div className="text-text-tertiary text-xs mt-1 truncate">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={`flex-1 ${sizeClasses[size].connector} min-w-8 mx-2 ${getConnectorColor(index)}`}
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
