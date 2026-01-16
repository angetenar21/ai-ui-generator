import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface InsightCardProps {
  /** Card title */
  title: string;

  /** Description or insight text */
  description: string;

  /** Visual variant/type */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';

  /** Optional metric to display */
  metric?: {
    value: string | number;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
  };

  /** Show icon */
  showIcon?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  variant = 'neutral',
  metric,
  showIcon = true,
}) => {
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
      bgClass: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      textClass: 'text-gray-900 dark:text-gray-100',
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
        return <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 my-4 border ${config.bgClass} hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        {showIcon && (
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.iconClass}`} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-lg font-display font-semibold ${config.textClass} mb-2`}>
            {title}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Metric */}
          {metric && (
            <div className="flex items-end gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {metric.label}
                </div>
              </div>

              {metric.trend && metric.trendValue && (
                <div className="flex items-center gap-1.5 mb-1">
                  {getTrendIcon()}
                  <span className={`text-sm font-semibold ${
                    metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                    metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-500 dark:text-gray-400'
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
