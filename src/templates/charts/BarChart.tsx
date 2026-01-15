import React from 'react';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { processSeriesColors } from '../core/utils';
import { getSurfaceClasses, getChartColors } from '@/theme/designTokens';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ChartPaletteType } from '../core/types';

interface BarChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** X-axis data (categories) */
  xAxis?: Array<{
    data: (number | string)[];
    label?: string;
    scaleType?: 'band' | 'linear';
  }>;

  /** Series data for the bars */
  series: Array<{
    data: number[];
    label?: string;
    color?: string;
    stack?: string;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Chart background color (plot area) */
  backgroundColor?: string;

  /** Card background color */
  cardBackgroundColor?: string;

  /** Layout orientation */
  layout?: 'horizontal' | 'vertical';

  /** Show grid lines */
  grid?: {
    vertical?: boolean;
    horizontal?: boolean;
  };

  /** Show legend */
  legend?: boolean;

  /** Margin around chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  /** Surface variant for visual hierarchy */
  variant?: SurfaceVariant;

  /** Elevation level for depth */
  elevation?: ElevationLevel;

  /** Visual emphasis level */
  emphasis?: EmphasisLevel;

  /** Chart color palette */
  palette?: ChartPaletteType;

  /** Use gradient fills */
  useGradient?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width = 800,
  height = 400,
  backgroundColor,
  cardBackgroundColor,
  layout = 'vertical',
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 50, right: 30, bottom: 50, left: 60 },
  variant = 'default',
  elevation = 'raised',
  emphasis = 'medium',
  palette = 'default',
  useGradient = false,
}) => {
  // Get palette colors
  const paletteColors = getChartColors(palette);

  // Process series colors with palette
  const processedSeries = processSeriesColors(
    series.map((s, index) => ({
      ...s,
      color: s.color || paletteColors[index % paletteColors.length],
    }))
  );

  // Process axes based on layout
  let processedXAxis = xAxis;
  let processedYAxis = undefined;

  // For horizontal layout, MUI X Charts expects:
  // - yAxis to have the categorical data (bands)
  // - xAxis to be continuous (values)
  if (layout === 'horizontal' && xAxis && xAxis.length > 0) {
    const firstAxis = xAxis[0];
    const firstValue = firstAxis.data && firstAxis.data[0];
    const isCategorical = typeof firstValue === 'string';

    if (isCategorical) {
      // Swap: move categorical data to yAxis, clear xAxis
      processedYAxis = xAxis.map(axis => ({
        ...axis,
        scaleType: 'band' as const,
      }));
      processedXAxis = undefined; // Let MUI auto-generate numeric xAxis
    }
  } else if (xAxis) {
    // For vertical layout, auto-detect scale type if not specified
    processedXAxis = xAxis.map(axis => {
      if (!axis.scaleType && axis.data && axis.data.length > 0) {
        const firstValue = axis.data[0];
        const inferredScaleType: 'band' | 'linear' = typeof firstValue === 'string' ? 'band' : 'linear';
        return { ...axis, scaleType: inferredScaleType };
      }
      return axis;
    });
  }

  // Use theme-aware background colors
  const plotBackgroundColor = backgroundColor || (variant === 'accent' || variant === 'gradient' ? 'transparent' : '#FFFFFF');
  const cardBgColor = cardBackgroundColor;

  // Build classes using design tokens
  const surfaceClasses = getSurfaceClasses(variant, elevation);

  return (
    <div
      className={`${surfaceClasses} rounded-xl p-6 my-4 transition-all duration-300`}
      style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
    >
      {/* Header */}
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

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center items-center min-h-[300px]">
          <MuiBarChart
            xAxis={processedXAxis}
            yAxis={processedYAxis}
            series={processedSeries}
            width={width}
            height={height}
            layout={layout}
            grid={grid}
            margin={margin}
            slotProps={{
              legend: legend
                ? {
                  position: { vertical: 'top', horizontal: 'center' },
                }
                : undefined,
            }}
            sx={{
              backgroundColor: plotBackgroundColor,
              borderRadius: '8px',
              padding: '16px',
              '& .MuiChartsAxis-line': {
                stroke: '#6B7280',
                strokeWidth: 1.5,
              },
              '& .MuiChartsAxis-tick': {
                stroke: '#6B7280',
                strokeWidth: 1,
              },
              '& .MuiChartsAxis-tickLabel': {
                fill: '#374151',
                fontSize: '13px',
                fontWeight: 500,
              },
              '& .MuiChartsLegend-series text': {
                fill: '#374151 !important',
                fontSize: '14px',
              },
              '& .MuiChartsGrid-line': {
                stroke: '#E5E7EB',
                strokeDasharray: '4 4',
                opacity: 0.8,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'bar-chart',
  category: 'charts' as const,
  component: BarChart,
  description: 'Bar chart for comparing categorical data with support for horizontal/vertical layout, stacked bars, visual variants, and color palettes',
  tags: ['chart', 'bar', 'column', 'comparison', 'categorical', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: 'Array<{ data, label?, scaleType? }>',
    series: 'Array<{ data, label?, color?, stack? }>',
    width: 'number',
    height: 'number',
    layout: "'horizontal' | 'vertical'",
    grid: '{ vertical?: boolean, horizontal?: boolean }',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
    variant: 'SurfaceVariant - Visual style: default | gradient | accent | glass | elevated | subtle (default: default)',
    elevation: 'ElevationLevel - Depth level: flat | raised | floating | overlay (default: raised)',
    emphasis: 'EmphasisLevel - Visual emphasis: low | medium | high (default: medium)',
    palette: 'ChartPaletteType - Color palette: default | vibrant | pastel | gradient | monochrome | semantic (default: default)',
    useGradient: 'boolean - Use gradient fills (default: false)',
  },
};
