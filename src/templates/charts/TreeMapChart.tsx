import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import type { SurfaceVariant, ElevationLevel , ChartPaletteType} from '../core/types';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses , getChartColors} from '@/theme/designTokens';

interface TreeMapChartProps {
  /** Chart title */
  title?: string;

  /** Hierarchical data - can be direct data or series format */
  data?: Array<{
    name: string;
    size: number;
    children?: Array<{
      name: string;
      size: number;
    }>;
  }>;

  /** Series format data (alternative to data prop) */
  series?: Array<{
    data: Array<{
      name: string;
      value: number;
      children?: Array<{
        name: string;
        value: number;
      }>;
    }>;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Color scheme */
  colors?: string[];

  /** Show labels */
  showLabels?: boolean;

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;

  palette?: ChartPaletteType;
}



const TreeMapChart: React.FC<TreeMapChartProps> = ({
  title,
  data,
  series,
  width: _width,
  height = 400,
  
  showLabels = true,
  variant = 'transparent',
  elevation = 'raised',
  palette = 'default'}) => {

  // Detect dark mode
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const colors = getChartColors(palette);
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const strokeColor = isDarkMode ? '#1F2937' : '#FFFFFF';

  // Transform data to ensure consistent format
  const transformData = (inputData: any): any[] => {
    if (!inputData) return [];

    return inputData.map((item: any) => ({
      name: item.name,
      size: item.size || item.value || 0,
      children: item.children?.map((child: any) => ({
        name: child.name,
        size: child.size || child.value || 0,
      })) || undefined,
    }));
  };

  // Get the actual data to render
  const chartData = React.useMemo(() => {
    if (data && data.length > 0) {
      return transformData(data);
    } else if (series && series.length > 0 && series[0].data) {
      return transformData(series[0].data);
    }
    return [];
  }, [data, series]);

  // Don't render if no data
  if (!chartData || chartData.length === 0) {
    return (
      <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
        {title && (
          <h3 className="text-xl font-display font-semibold text-zinc-900 dark:text-white mb-4">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center h-64 text-zinc-500">
          No data available
        </div>
      </div>
    );
  }
  const CustomContent = ({ depth, x, y, width, height, index, name, size }: any) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: strokeColor,
            strokeWidth: 2,
            fillOpacity: 1,
          }}
        />
        {showLabels && width > 50 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill={textColor}
            fontSize={14}
            fontWeight={depth === 1 ? 600 : 500}
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            style={{
              textRendering: 'optimizeLegibility',
              fontFeatureSettings: '"liga" 1, "kern" 1',
            }}
          >
            {name}
          </text>
        )}
        {showLabels && width > 50 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 18}
            textAnchor="middle"
            fill="#ffffffcc"
            fontSize={12}
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            style={{
              textRendering: 'optimizeLegibility',
              fontFeatureSettings: '"liga" 1, "kern" 1',
            }}
          >
            {size}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className={`${getSurfaceClasses(variant, elevation)} rounded-2xl p-6 transition-all duration-300`}>
      {title && (
        <h3 className="text-xl font-display font-semibold text-zinc-900 dark:text-white mb-4">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={chartData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke={strokeColor}
          content={<CustomContent />}
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            textRendering: 'optimizeLegibility',
          }}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '12px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
            labelStyle={{ color: isDarkMode ? '#f3f4f6' : '#111827' }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default TreeMapChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'treemap-chart',
  category: 'charts' as const,
  component: TreeMapChart,
  description: 'Tree map chart for displaying hierarchical data with nested rectangles proportional to values',
  tags: ['chart', 'treemap', 'hierarchy', 'nested', 'proportional', 'data-visualization'],
  propTypes: {
    title: 'string',
    data: 'Array<{ name, size, children? }>',
    series: 'Array<{ data: Array<{ name, value, children? }> }>',
    width: 'number',
    height: 'number',
    colors: 'string[]',
    showLabels: 'boolean',
  },
};
