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
      bgClass: 'bg-info/10 border-info/30',
      textClass: 'text-info',
      iconClass: 'text-info',
      Icon: Info,
    },
    success: {
      bgClass: 'bg-success/10 border-success/30',
      textClass: 'text-success',
      iconClass: 'text-success',
      Icon: CheckCircle,
    },
    warning: {
      bgClass: 'bg-warning/10 border-warning/30',
      textClass: 'text-warning',
      iconClass: 'text-warning',
      Icon: AlertTriangle,
    },
    error: {
      bgClass: 'bg-error/10 border-error/30',
      textClass: 'text-error',
      iconClass: 'text-error',
      Icon: XCircle,
    },
    neutral: {
      bgClass: 'bg-bg-surface/50 border-border-default',
      textClass: 'text-text-primary',
      iconClass: 'text-primary-500',
      Icon: Info,
    },
  };

  const config = variantConfig[variant];
  const Icon = config.Icon;

  const getTrendIcon = () => {
    if (!metric?.trend) return null;

    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-text-tertiary" />;
      default:
        return null;
    }
  };

  return (
    <div className={`card rounded-card p-6 my-4 border ${config.bgClass} hover:shadow-hover transition-all duration-200`}>
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
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Metric */}
          {metric && (
            <div className="flex items-end gap-4 pt-3 border-t border-border-subtle">
              <div>
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-text-muted uppercase tracking-wide">
                  {metric.label}
                </div>
              </div>

              {metric.trend && metric.trendValue && (
                <div className="flex items-center gap-1.5 mb-1">
                  {getTrendIcon()}
                  <span className={`text-sm font-semibold ${
                    metric.trend === 'up' ? 'text-success' :
                    metric.trend === 'down' ? 'text-error' :
                    'text-text-muted'
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
