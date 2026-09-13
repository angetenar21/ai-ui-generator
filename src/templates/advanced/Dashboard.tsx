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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({
  title,
  widgets = [],
  columns = 3,
  compact = false,
}) => {
  if (!Array.isArray(widgets) || widgets.length === 0) {
    return (
      <div className="card border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-6 my-2 shadow-sm">
        <div className="text-zinc-600 dark:text-zinc-400 text-sm">No widgets to display</div>
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
    <div className="my-3">
      {/* Dashboard Header */}
      {title && (
        <div className="mb-6">
          <h2 className="text-zinc-900 dark:text-white text-2xl font-bold font-display tracking-tight">{title}</h2>
        </div>
      )}

      {/* Widgets Grid */}
      <div className={`grid ${getGridColumns()} ${compact ? 'gap-3' : 'gap-5 lg:gap-6'}`}>
        {widgets.map((widget) => {
          const IconComponent = widget.icon ? iconMap[widget.icon] : Activity;

          return (
            <div
              key={widget.id}
              className={`
                bg-white dark:bg-zinc-900
                border border-zinc-200/80 dark:border-zinc-800
                ring-1 ring-black/[0.04] dark:ring-white/[0.04]
                rounded-2xl
                ${compact ? 'p-4' : 'p-5'}
                shadow-[0_2px_8px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]
                hover:shadow-[0_4px_12px_rgba(0,0,0,0.07),0_12px_32px_rgba(0,0,0,0.1)]
                hover:border-zinc-300 dark:hover:border-zinc-600
                transition-all duration-300
                ${getSizeClasses(widget.size)}
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5 truncate">
                    {widget.title}
                  </div>
                  <div className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                    {widget.value}
                  </div>
                </div>

                <div className="flex-shrink-0 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-200/60 dark:ring-orange-800/40">
                  <IconComponent className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                {widget.subtitle && (
                  <div className="text-zinc-400 dark:text-zinc-500 text-xs truncate">
                    {widget.subtitle}
                  </div>
                )}

                {widget.change && (
                  <div className={`
                    flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0
                    ${widget.changeType === 'positive' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : ''}
                    ${widget.changeType === 'negative' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}
                    ${widget.changeType === 'neutral' || !widget.changeType ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400' : ''}
                  `}>
                    {widget.changeType === 'positive' && <span>↑</span>}
                    {widget.changeType === 'negative' && <span>↓</span>}
                    {widget.change}
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
