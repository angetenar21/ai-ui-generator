import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { elevation as elevationTokens } from '@/theme/designTokens';
import type { ElevationLevel } from '../core/types';

interface InsightCardProps {
  /** Card title */
  title: string;

  /** Description or insight text */
  description: string;

  /** Visual variant/type */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';

  /** Elevation level for depth */
  elevation?: ElevationLevel;

  /** Optional metric to display */
  metric?: {
    value: string | number;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;

    children?: React.ReactNode;
    renderChild?: (child: any) => React.ReactNode;
  };

  /** Show icon */
  showIcon?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  variant = 'neutral',
  elevation = 'raised',
  metric,
  showIcon = true,
}) => {
  const elevationClass = elevationTokens[elevation] || elevationTokens.raised;
  const variantConfig = {
    info: {
      bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      textClass: 'text-blue-700 dark:text-blue-300',
      iconClass: 'text-blue-600 dark:text-blue-400',
      Icon: Info,
    },
    success: {
      bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      textClass: 'text-green-700 dark:text-green-300',
      iconClass: 'text-green-600 dark:text-green-400',
      Icon: CheckCircle,
    },
    warning: {
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      textClass: 'text-yellow-700 dark:text-yellow-300',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      Icon: AlertTriangle,
    },
    error: {
      bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      textClass: 'text-red-700 dark:text-red-300',
      iconClass: 'text-red-600 dark:text-red-400',
      Icon: XCircle,
    },
    neutral: {
      bgClass: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
      textClass: 'text-zinc-900 dark:text-zinc-100',
      iconClass: 'text-orange-500 dark:text-orange-400',
      Icon: Info,
    },
  };

  const config = variantConfig[variant];
  const Icon = config.Icon;

  const getTrendIcon = () => {
    if (!metric?.trend) return null;

    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-zinc-800 rounded-2xl p-6 border ${config.bgClass} ${elevationClass} transition-all duration-300 ease-out hover:-translate-y-0.5 text-zinc-900 dark:text-white`}>
      <div className="flex-1 flex flex-col items-start gap-4">
        {/* Icon */}
        {showIcon && (
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${config.bgClass} flex items-center justify-center mb-2`}>
            <Icon className={`w-7 h-7 ${config.iconClass}`} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 w-full flex flex-col min-w-0">
          <h4 className={`text-lg font-display font-semibold ${config.textClass} mb-2`}>
            {title}
          </h4>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6">
            {description}
          </p>

          {/* Metric (Pushed to bottom using mt-auto) */}
          {metric && (
            <div className="mt-auto flex justify-between items-end gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-700/50">
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider mb-1">
                  {metric.label}
                </div>
                <div className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white">
                  {metric.value}
                </div>
              </div>

              {metric.trend && metric.trendValue && (
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-zinc-50 dark:bg-zinc-700/50">
                  {getTrendIcon()}
                  <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                    metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                      'text-zinc-500 dark:text-zinc-400'
                    }`}>
                    {metric.trendValue}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;

// Component metadata for auto-registration
export const metadata = {
  name: 'insight-card',
  category: 'surfaces' as const,
  component: InsightCard,
  description: 'Card component for displaying key insights, findings, and metrics with visual indicators',
  tags: ['card', 'insight', 'metric', 'summary', 'kpi'],
  propTypes: {
    title: 'string (required)',
    description: 'string (required)',
    variant: '"info" | "success" | "warning" | "error" | "neutral"',
    elevation: 'ElevationLevel - Depth level: flat | raised | floating | overlay (default: raised)',
    metric: '{ value, label, trend?, trendValue? }',
    showIcon: 'boolean',
  },
  examples: [
    {
      name: 'Success insight with metric',
      props: {
        title: 'System Performance Excellent',
        description: 'All services are operating within normal parameters. Response times are 15% better than average.',
        variant: 'success',
        metric: {
          value: '99.8%',
          label: 'Uptime',
          trend: 'up',
          trendValue: '+0.3%',
        },
      },
    },
    {
      name: 'Warning alert',
      props: {
        title: 'High Memory Usage Detected',
        description: 'The user-service is consuming 85% of allocated memory. Consider scaling up.',
        variant: 'warning',
        metric: {
          value: '85%',
          label: 'Memory Usage',
          trend: 'up',
          trendValue: '+12%',
        },
      },
    },
  ],
};
