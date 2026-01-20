import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

interface StackedAreaChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;
  xAxis?: Array<{ dataKey?: string; label?: string }>;
  series?: Array<{ dataKey: string; name?: string; color?: string; stackId?: string }>;
}

// Color palette for stacked areas
const COLOR_PALETTE = [
  '#F97316', // Orange
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
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
  series
}) => {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
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
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6">
        {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
        <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
          No data available for stacked area chart
        </div>
      </div>
    );
  }

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>}
          {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
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
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              color: tooltipText,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
