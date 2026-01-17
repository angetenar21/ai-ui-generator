import React from 'react';
import { Funnel, Tooltip, ResponsiveContainer, FunnelChart as RechartsFunnelChart, Cell, LabelList, Legend } from 'recharts';

interface FunnelChartProps {
  title?: string;
  description?: string;
  data: Array<{ name: string; value: number; color?: string }>;
  width?: number;
  height?: number;
  colors?: string[];
  legend?: boolean;
}

// Default color palette for funnel segments
const DEFAULT_COLORS = [
  '#8b5cf6', // violet
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#ec4899', // pink
];

const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  description,
  data,
  height = 360,
  colors = DEFAULT_COLORS,
  legend = true,
}) => {
  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const secondaryText = isDarkMode ? '#9CA3AF' : '#6B7280';

  // Defensive: handle empty or invalid data
  const validData = Array.isArray(data)
    ? data
      .filter((d) => typeof d?.value === 'number' && !Number.isNaN(d.value))
      .map((d) => ({ ...d, value: Math.max(d.value, 0) }))
    : [];

  if (!validData.length) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 my-2 border border-gray-200 dark:border-gray-700">
        {(title || description) && (
          <div className="mb-3 text-center">
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-center min-h-[220px] text-sm text-gray-600 dark:text-gray-300">
          No data available
        </div>
      </div>
    );
  }

  // Ensure descending values for a smooth funnel shape
  const sortedData = [...validData].sort((a, b) => b.value - a.value);

  // Add colors to data if not provided
  const coloredData = sortedData.map((item, index) => ({
    ...item,
    fill: item.color || colors[index % colors.length],
  }));

  // Precompute display labels that include value for clearer readability
  const labeledData = coloredData.map((item) => ({
    ...item,
    label: `${item.name} — ${item.value}`,
  }));

  // Custom legend renderer for proper alignment
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: textColor }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 my-2 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      {(title || description) && (
        <div className="mb-3 text-center">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height} minHeight={320}>
        <RechartsFunnelChart data={labeledData} margin={{ top: 8, right: 12, bottom: 8, left: 12 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: textColor,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: secondaryText, fontWeight: 600 }}
            formatter={(value: number, name: string) => [value, name]}
          />
          {legend && (
            <Legend
              content={renderLegend}
              verticalAlign="bottom"
              align="center"
            />
          )}
          <Funnel dataKey="value" data={labeledData} isAnimationActive>
            <LabelList
              position="insideRight"
              fill={textColor}
              stroke="none"
              dataKey="label"
              style={{ fontSize: '13px', fontWeight: 600 }}
            />
            {labeledData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;

export const metadata = {
  name: 'funnel-chart',
  category: 'charts' as const,
  component: FunnelChart,
  description: 'Funnel chart for conversion funnels with distinct colors per segment and centered legend',
  tags: ['chart', 'funnel', 'conversion', 'sales', 'marketing'],
  propTypes: {
    title: 'string',
    description: 'string',
    data: 'Array<{ name: string, value: number, color?: string }>',
    height: 'number',
    colors: 'string[] - Custom color palette',
    legend: 'boolean - Show legend (default: true)',
  },
};
