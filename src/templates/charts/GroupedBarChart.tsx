import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface GroupedBarChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ title, description, data, height = 400 }) => {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#111827';

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-card p-6">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
          <Bar dataKey="value" fill="#10B981" />
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
