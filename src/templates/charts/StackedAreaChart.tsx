import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import type { SurfaceVariant, ElevationLevel , ChartPaletteType} from '../core/types';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses , getChartColors} from '@/theme/designTokens';

interface StackedAreaChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;
  xAxis?: Array<{ dataKey?: string; label?: string 
}>;
  series?: Array<{ dataKey: string; name?: string; color?: string; stackId?: string }>;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;

  palette?: ChartPaletteType;
}

// Color palette for stacked areas
const COLOR_PALETTE = [
  '#10B981', // Emerald
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F59E0B', // Teal
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#D946EF', // Fuchsia
];

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  title,
  description,
  data,
  height = 400,
  xAxis,
  series,
  variant = 'transparent',
  elevation = 'raised',
  palette = 'default'}) => {
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#111827';

  // Auto-detect series from data if not provided
  let detectedSeries = series;
  if (!detectedSeries && data && data.length > 0) {
    const firstItem = data[0];
    const keys = Object.keys(firstItem).filter(key =>
      key !== 'name' &&
      key !== 'label' &&
      key !== 'category' &&
      key !== 'date' &&
      key !== 'time' &&
      typeof firstItem[key] === 'number'
    );
    detectedSeries = keys.map(key => ({
      dataKey: key,
      name: key,
      stackId: '1'
    }));
  }

  // Get x-axis key
  const xAxisKey = xAxis?.[0]?.dataKey || 'name';

  // Validate data
  if (!data || data.length === 0 || !detectedSeries || detectedSeries.length === 0) {
    return (
      <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
        {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
        {description && <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{description}</p>}
        <div className="flex items-center justify-center h-64 text-zinc-400 dark:text-zinc-500">
          No data available for stacked area chart
        </div>
      </div>
    );
  }

  return (
    <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>}
          {description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 60 }}>
          <defs>
            {detectedSeries.map((s, index) => {
              const color = s.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <linearGradient key={s.dataKey} id={`color-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '12px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
            labelStyle={{ color: tooltipText, fontWeight: 600 }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingBottom: '12px',
            }}
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>{value}</span>
            )}
            iconSize={12}
            iconType="rect"
          />
          {detectedSeries.map((s, index) => {
            const color = s.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stackId={s.stackId || '1'}
                stroke={color}
                strokeWidth={2}
                fill={`url(#color-${s.dataKey})`}
                fillOpacity={1}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaChart;

export const metadata = {
  name: 'stacked-area-chart',
  category: 'charts' as const,
  component: StackedAreaChart,
  description: 'Stacked area chart',
  tags: ['chart'],
};
