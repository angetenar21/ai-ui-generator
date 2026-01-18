import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface StackedBarChartProps {
  title?: string;
  description?: string;
  data: any[];
  width?: number;
  height?: number;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ title, description, data, height = 400 }) => {
  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#111827';

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-card p-6 my-1">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary leading-relaxed">
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
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '8px',
            }}
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: '12px', fontWeight: 500 }}>{value}</span>
            )}
            iconSize={10}
          />
          <Bar dataKey="value" fill="#F97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;

export const metadata = {
  name: 'stacked-bar-chart-v2',
  category: 'charts' as const,
  component: StackedBarChart,
  description: 'Stacked bar variant',
  tags: ['chart'],
};
