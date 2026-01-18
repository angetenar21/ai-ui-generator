import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';

interface StackedAreaChartProps {
  title?: string;
  data: any[];
  width?: number;
  height?: number;
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({ title, data, height = 400 }) => {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-1">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} />
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
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
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
