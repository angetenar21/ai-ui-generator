import React, { useRef, useState, useEffect } from 'react';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { processSeriesColors } from '../core/utils';
import { getSurfaceClasses, getChartColors } from '@/theme/designTokens';
import { getTextColorForBackground, getSecondaryTextColorForBackground } from '../core/colorUtils';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ChartPaletteType } from '../core/types';
import { useAppStore } from '@/store/appStore';

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

  /** Scale type for the value axis (linear, log, sqrt) */
  scaleType?: 'linear' | 'log' | 'sqrt';

  /** Optional CSS class names */
  className?: string;

}

const BarChart: React.FC<BarChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width: propWidth,
  height = 360,
  backgroundColor,
  cardBackgroundColor,
  layout = 'vertical',
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 40, right: 20, bottom: 40, left: 60 },
  variant = 'transparent',
  elevation = 'raised',
  emphasis: _emphasis = 'medium',
  palette = 'default',
  useGradient: _useGradient = false,
  scaleType = 'linear',
  className = '',
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
        nextWidth = Math.max(200, maxWidth); // Enforce full responsive width, ignore AI-generated fixed widths
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
  const processedSeries = series && Array.isArray(series) ? processSeriesColors(
    series.map((s, index) => ({
      ...s,
      color: s.color || paletteColors[index % paletteColors.length],
    }))
  ) : [];

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

  // Auto-detect label density to prevent overlap
  const totalXPoints = xAxis && xAxis[0]?.data?.length || 0;
  const labelRotation = totalXPoints > 20 ? -45 : 0;
  const tickInterval = totalXPoints > 50 ? Math.ceil(totalXPoints / 20) : totalXPoints > 20 ? 2 : 1;
  const bottomMargin = totalXPoints > 20
    ? Math.max((margin?.bottom || 40), 80)
    : (margin?.bottom || 40);
  const effectiveMargin = { ...margin, bottom: bottomMargin };

  // Detect dark mode for chart styling
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const chartColors = {
    axisLine: isDarkMode ? '#9CA3AF' : '#6B7280',
    axisTick: isDarkMode ? '#9CA3AF' : '#6B7280',
    tickLabel: isDarkMode ? '#E5E7EB' : '#374151',
    legendText: isDarkMode ? '#E5E7EB' : '#374151',
    gridLine: isDarkMode ? '#374151' : '#E5E7EB',
    background: backgroundColor || 'transparent',
  };

  // Build classes using design tokens
  const surfaceClasses = 'bg-transparent border-transparent';

  // Determine text colors based on card background
  const titleTextColor = getTextColorForBackground(cardBackgroundColor);
  const descriptionTextColor = getSecondaryTextColorForBackground(cardBackgroundColor);

  // Validation
  // Ensure we have at least one numeric value that isn't 0 (to avoid flatlines being rendered as "No Data" by MUI inner internals)
  const hasValidData = series && series.length > 0 && series.some(s =>
    s.data && s.data.length > 0 && s.data.some((val: any) => val !== 0 && val !== null)
  );

  if (!hasValidData) {
    return (
      <div className={`${surfaceClasses} rounded-xl p-6 transition-all duration-300`}>
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
        <div className="flex justify-center items-center min-h-[300px] text-zinc-600 dark:text-zinc-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${surfaceClasses} rounded-xl p-4 transition-all duration-300 ${className || 'w-full'} max-w-full min-w-0 overflow-x-auto h-full flex flex-col`}
      style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-3">
          {title && (
            <h3 className={`text-base font-semibold ${titleTextColor}`}>
              {title}
            </h3>
          )}
          {description && (
            <p className={`text-xs ${descriptionTextColor} mt-1`}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div ref={containerRef} className="w-full overflow-x-auto overflow-y-hidden">
        <div className="flex justify-center items-center min-h-[200px]">
          <MuiBarChart
            xAxis={layout === 'horizontal' ? [{ scaleType }] : (processedXAxis || []).map((axis: any) => ({
              ...axis,
              tickInterval: tickInterval > 1
                ? (_value: any, index: number) => index % tickInterval === 0
                : undefined,
              categoryGapRatio: 0.4,
              barGapRatio: 0.1,
            }))}
            yAxis={layout === 'horizontal' ? processedYAxis : [{ scaleType }]}
            series={processedSeries}
            width={chartWidth}
            height={height}
            layout={layout}
            grid={grid}
            margin={effectiveMargin}
            slotProps={{
              bar: { rx: 6, ry: 6 },
              legend: legend
                ? {
                  direction: 'horizontal' as const,
                  position: { vertical: 'top', horizontal: 'center' } as const,
                }
                : undefined,
            }}
            sx={{
              backgroundColor: chartColors.background,
              borderRadius: '8px',
              '& .MuiChartsAxis-line': {
                stroke: 'currentColor', 
                opacity: 0.2,
                strokeWidth: 1.5,
              },
              '& .MuiChartsAxis-tick': {
                stroke: 'currentColor', 
                opacity: 0.2,
                strokeWidth: 1,
              },
              '& .MuiChartsAxis-tickLabel': {
                fill: 'currentColor',
                      fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 500,
                ...(labelRotation !== 0 ? {
                  transform: `rotate(${labelRotation}deg)`,
                  textAnchor: 'end',
                } : {}),
              },
              '& .MuiChartsLegend-root': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              },
              '& .MuiChartsLegend-series': {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              },
              '& .MuiChartsLegend-series text': {
                fill: `${chartColors.legendText} !important`,
                      fontFamily: 'inherit',
                fontSize: '12px',
                fontWeight: 500,
              },
              '& .MuiChartsLegend-mark': {
                rx: 2,
                width: '12px',
                height: '12px',
              },
              '& .MuiChartsGrid-line': {
                stroke: 'currentColor',
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
    scaleType: '"linear" | "log" | "sqrt" (default: linear)',
    className: 'string - Optional CSS class names',
  },
};
