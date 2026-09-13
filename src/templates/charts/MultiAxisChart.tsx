import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';
import type { SurfaceVariant, ElevationLevel , ChartPaletteType} from '../core/types';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses , getChartColors} from '@/theme/designTokens';

interface MultiAxisChartProps {
  title?: string;
  data: any[];
  width?: number;
  height?: number;
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;

  palette?: ChartPaletteType;
}



const MultiAxisChart: React.FC<MultiAxisChartProps> = ({ title, data, height = 400,
  variant = 'transparent',
  elevation = 'raised',
  palette = 'default'}) => {
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const colors = getChartColors(palette);
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const textColor = isDarkMode ? '#E5E7EB' : '#374151';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipText = isDarkMode ? '#E5E7EB' : '#1F2937';

  // Auto-detect numeric keys from data
  const dataKeys = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    return Object.keys(sample).filter(k =>
      k !== 'name' && k !== 'label' && k !== 'category' && typeof sample[k] === 'number'
    );
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
        {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
        <div className="text-center text-zinc-400"><p className="text-sm">No data available</p></div>
      </div>
    );
  }

  return (
    <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
      {title && <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
          
          {/* Left Y-axis for first series (bar) */}
          <YAxis yAxisId="left" tick={{ fill: textColor }} />
          
          {/* Right Y-axis for second series (line) */}
          {dataKeys.length > 1 && (
            <YAxis yAxisId="right" orientation="right" tick={{ fill: textColor }} />
          )}

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
          />
          <Legend wrapperStyle={{ color: textColor }} />
          
          {/* First series as bars on left axis */}
          {dataKeys[0] && (
            <Bar yAxisId="left" dataKey={dataKeys[0]} fill={colors[0]} radius={[4, 4, 0, 0]} barSize={30} />
          )}
          
          {/* Remaining series as lines on right axis */}
          {dataKeys.slice(1).map((key, i) => (
            <Line
              key={key}
              yAxisId={i === 0 ? 'right' : 'left'}
              type="monotone"
              dataKey={key}
              stroke={colors[(i + 1) % colors.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: colors[(i + 1) % colors.length] }}
            />
          ))}
          
          {/* If only one data key, render it as a bar on left axis */}
          {dataKeys.length <= 1 && dataKeys[0] && null}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiAxisChart;

export const metadata = {
  name: 'multi-axis-chart',
  category: 'charts' as const,
  component: MultiAxisChart,
  description: 'Combined bar and line chart with dual Y-axes for comparing different scales',
  tags: ['chart', 'multi-axis', 'dual-axis', 'composed', 'bar-line'],
  propTypes: {
    title: 'string',
    data: 'Array<{ name, [series1]: number, [series2]: number, ... }>',
    height: 'number',
  },
};
