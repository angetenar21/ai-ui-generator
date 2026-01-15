import React from 'react';
import { Activity, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

interface Widget {
  /** Widget ID */
  id: string;

  /** Widget title */
  title: string;

  /** Widget value/metric */
  value: string | number;

  /** Optional subtitle or description */
  subtitle?: string;

  /** Change percentage */
  change?: string;

  /** Change type */
  changeType?: 'positive' | 'negative' | 'neutral';

  /** Icon name */
  icon?: 'activity' | 'trending' | 'users' | 'dollar' | 'chart';

  /** Widget size */
  size?: 'small' | 'medium' | 'large';
}

interface DashboardProps {
  /** Dashboard title */
  title?: string;

  /** Array of widget configurations */
  widgets: Widget[];

  /** Grid layout columns */
  columns?: 2 | 3 | 4;

  /** Compact mode (smaller spacing) */
  compact?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  title,
  widgets = [],
  columns = 3,
  compact = false,
}) => {
  if (!Array.isArray(widgets) || widgets.length === 0) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-lg p-6 my-2">
        <div className="text-text-tertiary text-sm">No widgets to display</div>
      </div>
    );
  }

  const iconMap = {
    activity: Activity,
    trending: TrendingUp,
    users: Users,
    dollar: DollarSign,
    chart: BarChart3,
  };

  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      case 'neutral':
        return 'text-text-tertiary';
      default:
        return 'text-text-tertiary';
    }
  };

  const getSizeClasses = (size?: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'large':
        return 'col-span-1 md:col-span-2';
      default:
        return 'col-span-1';
    }
  };

  return (
    <div className="my-2">
      {/* Dashboard Header */}
      {title && (
        <div className="mb-6">
          <h2 className="text-text-primary text-2xl font-bold">{title}</h2>
        </div>
      )}

      {/* Widgets Grid */}
      <div className={`grid ${getGridColumns()} gap-${compact ? '3' : '4'}`}>
        {widgets.map((widget) => {
          const IconComponent = widget.icon ? iconMap[widget.icon] : Activity;

          return (
            <div
              key={widget.id}
              className={`
                glass-dark border border-gray-700/50 rounded-lg
                p-${compact ? '4' : '6'}
                hover:border-gray-600/50 transition-all
                ${getSizeClasses(widget.size)}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-text-tertiary text-sm font-medium mb-1">
                    {widget.title}
                  </div>
                  <div className="text-text-primary text-2xl font-bold">
                    {widget.value}
                  </div>
                </div>

                {widget.icon && (
                  <div className="p-2 rounded-lg bg-primary-500/20">
                    <IconComponent className="w-5 h-5 text-primary-500" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                {widget.subtitle && (
                  <div className="text-text-tertiary text-xs">
                    {widget.subtitle}
                  </div>
                )}

                {widget.change && (
                  <div className={`text-xs font-medium ${getChangeColor(widget.changeType)}`}>
                    {widget.changeType === 'positive' && '↑ '}
                    {widget.changeType === 'negative' && '↓ '}
                    {widget.change}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 text-text-tertiary text-xs text-center">
        {widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'} displayed
      </div>
    </div>
  );
};

export default Dashboard;

export const metadata = {
  name: 'dashboard',
  category: 'advanced' as const,
  component: Dashboard,
  description: 'Dashboard layout with customizable widget grid and responsive design',
  tags: ['dashboard', 'analytics', 'metrics', 'widgets', 'grid', 'statistics'],
  propTypes: {
    title: 'string - Optional dashboard title',
    widgets: 'array (required) - Array of widget objects with id, title, value, subtitle, change, changeType, icon, and size',
    columns: 'number - Grid columns: 2, 3, 4 (default: 3)',
    compact: 'boolean - Compact mode with smaller spacing (default: false)',
  },
};
