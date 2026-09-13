import React from 'react';
import { Funnel, Tooltip, ResponsiveContainer, FunnelChart as RechartsFunnelChart, Cell, LabelList } from 'recharts';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses , getChartColors} from '@/theme/designTokens';


import type { SurfaceVariant, ElevationLevel , ChartPaletteType} from '../core/types';

interface FunnelChartProps {
  title?: string;
  description?: string;
  data: Array<{ name: string; value: number; color?: string 
}>;
  width?: number;
  height?: number;
  colors?: string[];
  legend?: boolean;


  variant?: SurfaceVariant;
  elevation?: ElevationLevel;

  palette?: ChartPaletteType;
}

// Default color palette for funnel segments


const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  description,
  data,
  height = 420,
  
  legend = true,
  variant = 'transparent',
  elevation = 'raised',
  palette = 'default'}) => {
  // Detect dark mode
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const colors = getChartColors(palette);
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
      <div className="w-full bg-transparent dark:bg-transparent rounded-2xl p-6 border border-zinc-200/60 dark:border-zinc-700/60 transition-all duration-300">
        {(title || description) && (
          <div className="mb-3 text-center">
            {title && (
              <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{description}</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-center min-h-[220px] text-sm text-zinc-600 dark:text-zinc-300">
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

  // Build tapered shape values to keep the funnel silhouette even when values are close.
  const maxValue = Math.max(...coloredData.map(d => d.value), 1);
  const epsilon = Math.max(maxValue * 0.01, 0.1); // minimum step-down per row
  const minBand = Math.max(maxValue * 0.02, 0.5); // avoid collapsing to a line

  const taperedData = coloredData.map((item, idx) => {
    const adjusted = Math.max(item.value - idx * epsilon, minBand);
    return {
      ...item,
      shapeValue: adjusted,
    };
  });

  // Precompute display labels that include the original value for readability
  const labeledData = taperedData.map((item) => ({
    ...item,
    label: `${item.name} — ${item.value}`,
  }));

  // Custom legend renderer for proper alignment
  const renderLegendItems = (items: typeof labeledData) => (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-4 px-2">
      {items.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ backgroundColor: entry.fill }} />
          <span className="text-sm font-medium" style={{ color: textColor }}>
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-transparent dark:bg-transparent rounded-2xl p-6 border border-zinc-200/60 dark:border-zinc-700/60 transition-all duration-300">
      {/* Header */}
      {(title || description) && (
        <div className="mb-3 text-center">
          {title && (
            <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height} minHeight={360}>
        <RechartsFunnelChart data={labeledData} margin={{ top: 16, right: 64, bottom: 24, left: 60 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '12px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: secondaryText, fontWeight: 600 }}
            formatter={(_value: number, name: string, props: any) => [props?.payload?.value, props?.payload?.name || name]}
          />
          <Funnel dataKey="shapeValue" data={labeledData} isAnimationActive>
            <LabelList
              position="right"
              fill={textColor}
              stroke="none"
              dataKey="label"
              offset={8}
              style={{ fontSize: '11px', fontWeight: 600 }}
            />
            {labeledData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>
      {legend && renderLegendItems(labeledData)}
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
