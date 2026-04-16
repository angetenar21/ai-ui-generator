import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import type { SurfaceVariant, ElevationLevel } from '../core/types';
import { useAppStore } from '@/store/appStore';

interface GroupedBarChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ title, description, data, height = 400,
  variant = 'transparent',
  elevation = 'raised',
}) => {
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#111827';

  return (
    <div className={`bg-transparent border-transparent rounded-2xl p-6 transition-all duration-300`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={gridColor} opacity={0.8} />
          <XAxis tick={{ fill: textColor, fontSize: 13, fontWeight: 500 }} />
          <YAxis tick={{ fill: textColor, fontSize: 13, fontWeight: 500 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: tooltipText, fontWeight: 600 }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '16px' }}
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupedBarChart;

export const metadata = {
  name: 'grouped-bar-chart',
  category: 'charts' as const,
  component: GroupedBarChart,
  description: 'Grouped bar chart',
  tags: ['chart'],
};
