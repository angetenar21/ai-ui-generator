import React from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import type { SurfaceVariant, ElevationLevel } from '../core/types';
import { useAppStore } from '@/store/appStore';

interface MultiLineChartProps {
  title?: string;
  data: any[];
  width?: number;
  height?: number;
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const MultiLineChart: React.FC<MultiLineChartProps> = ({ title, data, height = 400,
  variant = 'transparent',
  elevation = 'raised',
}) => {
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#1F2937';

  // Auto-detect numeric keys from data to render as separate lines
  const dataKeys = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    return Object.keys(sample).filter(k =>
      k !== 'name' && k !== 'label' && k !== 'category' && typeof sample[k] === 'number'
    );
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300">
        {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-zinc-400"><p className="text-sm">No data available</p></div>
      </div>
    );
  }

  return (
    <div className="bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300">
      {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText }}
            labelStyle={{ color: tooltipText, fontWeight: 600 }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingBottom: '8px' }}
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>{value}</span>
            )}
            iconSize={10}
          />
          {dataKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: COLORS[i % COLORS.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineChart;

export const metadata = {
  name: 'multi-line-chart',
  category: 'charts' as const,
  component: MultiLineChart,
  description: 'Multiple line series chart for comparing trends across categories',
  tags: ['chart', 'line', 'multi-line', 'trend', 'comparison'],
  propTypes: {
    title: 'string',
    data: 'Array<{ name, [series1]: number, [series2]: number, ... }>',
    height: 'number',
  },
};
