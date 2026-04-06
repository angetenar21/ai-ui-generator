import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { getSurfaceClasses } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel } from '../core/types';

interface MultiAxisChartProps {
  title?: string;
  data: any[];
  width?: number;
  height?: number;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
}

const MultiAxisChart: React.FC<MultiAxisChartProps> = ({ title, data, height = 400,
  variant = 'default',
  elevation = 'raised',
}) => {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const legendColor = isDarkMode ? '#E5E7EB' : '#374151';

  return (
    <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
      {title && <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} />
          <Legend wrapperStyle={{ color: legendColor }} />
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiAxisChart;

export const metadata = {
  name: 'multi-axis-chart',
  category: 'charts' as const,
  component: MultiAxisChart,
  description: 'Chart with multiple axes',
  tags: ['chart'],
};
