import React, { useRef, useState, useEffect } from 'react';
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
  width: propWidth,
  height = 280,
  backgroundColor,
  cardBackgroundColor,
  layout = 'vertical',
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 40, right: 20, bottom: 40, left: 50 },
  variant = 'default',
  elevation = 'raised',
  emphasis: _emphasis = 'medium',
  palette = 'default',
  useGradient: _useGradient = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(propWidth || 500);

  useEffect(() => {
    const updateWidth = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = propWidth || 360;

      let nextWidth = fallbackWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = propWidth ? Math.min(propWidth, maxWidth) : maxWidth;
      }

      const minWidth = typeof maxWidth === 'number' ? Math.min(200, maxWidth) : 200;
      const maxWidthClamp = typeof maxWidth === 'number' ? maxWidth : 1600;

      setChartWidth(Math.max(minWidth, Math.min(nextWidth, maxWidthClamp)));
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [propWidth]);

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
  const cardBgColor = cardBackgroundColor;

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const chartColors = {
    axisLine: isDarkMode ? '#6B7280' : '#6B7280',
    axisTick: isDarkMode ? '#6B7280' : '#6B7280',
    tickLabel: isDarkMode ? '#D1D5DB' : '#374151',
    legendText: isDarkMode ? '#D1D5DB' : '#374151',
    gridLine: isDarkMode ? '#374151' : '#E5E7EB',
    background: backgroundColor || 'transparent',
  };

  // Build classes using design tokens
  const surfaceClasses = getSurfaceClasses(variant, elevation);

  return (
    <div
      className={`${surfaceClasses} rounded-xl p-4 my-2 transition-all duration-300 w-full max-w-full overflow-hidden`}
      style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div ref={containerRef} className="w-full overflow-x-auto overflow-y-hidden">
        <div className="flex justify-center items-center min-h-[200px]">
          <MuiBarChart
            xAxis={processedXAxis}
            yAxis={processedYAxis}
            series={processedSeries}
            width={chartWidth}
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
              backgroundColor: chartColors.background,
              borderRadius: '8px',
              '& .MuiChartsAxis-line': {
                stroke: chartColors.axisLine,
                strokeWidth: 1.5,
              },
              '& .MuiChartsAxis-tick': {
                stroke: chartColors.axisTick,
                strokeWidth: 1,
              },
              '& .MuiChartsAxis-tickLabel': {
                fill: chartColors.tickLabel,
                fontSize: '13px',
                fontWeight: 500,
              },
              '& .MuiChartsLegend-series text': {
                fill: `${chartColors.legendText} !important`,
                fontSize: '14px',
              },
              '& .MuiChartsGrid-line': {
                stroke: chartColors.gridLine,
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
