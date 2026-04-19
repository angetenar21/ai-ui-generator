import React, { useRef, useState, useEffect } from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { processSeriesColors } from '../core/utils';
import { getSurfaceClasses, getChartColors } from '@/theme/designTokens';
import { getTextColorForBackground, getSecondaryTextColorForBackground, getChartTheme, buildChartSx } from '../core/colorUtils';
import { useAppStore } from '@/store/appStore';
import type { SurfaceVariant, ElevationLevel, EmphasisLevel, ChartPaletteType } from '../core/types';

interface LineChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** X-axis data points */
  xAxis?: Array<{
    data: (number | string | Date)[];
    label?: string;
    scaleType?: 'band' | 'linear' | 'log' | 'time';
  }>;

  /** Series data for the lines */
  series: Array<{
    data: number[];
    label?: string;
    color?: string;
    curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step';
    showMark?: boolean;
    area?: boolean;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Chart background color (plot area) */
  backgroundColor?: string;

  /** Card background color */
  cardBackgroundColor?: string;

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

  /** Use gradient fills for area charts */
  useGradient?: boolean;

  /** Optional CSS class names */
  className?: string;

  /** Object-array format: [{month: "Jan", sales: 4200, returns: 380}, ...] */
  data?: Record<string, string | number>[];
  /** Key in data objects used as x-axis categories (required with data) */
  xKey?: string;
  /** Explicit keys to extract as series; defaults to all numeric keys except xKey */
  seriesKeys?: string[];
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  description,
  xAxis: xAxisProp,
  series: seriesProp,
  data: rawData,
  xKey,
  seriesKeys,
  width: propWidth,
  height = 360,
  backgroundColor,
  cardBackgroundColor,
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 40, right: 20, bottom: 40, left: 60 },
  variant = 'transparent',
  elevation = 'raised',
  emphasis: _emphasis = 'medium',
  palette = 'default',
  useGradient: _useGradient = false,
  className = '',
}) => {
  // Object-array → MUI format transformer
  let xAxis = xAxisProp;
  let series = seriesProp;
  if (rawData && Array.isArray(rawData) && rawData.length > 0 && xKey) {
    const categories = rawData.map(row => String(row[xKey] ?? ''));
    const numericKeys = seriesKeys
      ? seriesKeys
      : Object.keys(rawData[0]).filter(k => k !== xKey && typeof rawData[0][k] === 'number');
    xAxis = [{ data: categories, scaleType: 'band' as const }];
    series = numericKeys.map(key => ({
      label: key,
      data: rawData.map(row => (typeof row[key] === 'number' ? (row[key] as number) : 0)),
    }));
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(propWidth || 500);

  // Reactive dark mode via Zustand — must be at top level, before any early return
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
  const surfaceClasses = getSurfaceClasses(variant, elevation);

  // Determine text colors based on card background
  const titleTextColor = getTextColorForBackground(cardBackgroundColor);
  const descriptionTextColor = getSecondaryTextColorForBackground(cardBackgroundColor);

  // Validation and error handling
  // Ensure we have at least one numeric value that isn't 0
  const hasValidData = series && series.length > 0 && series.some(s =>
    s.data && s.data.length > 0 && s.data.some((val: any) => val !== 0 && val !== null)
  );

  if (!hasValidData) {
    console.warn('[LineChart] No valid series data provided:', { series });
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

  // Process series colors with palette and force linear curve by default
  const processedSeries = processSeriesColors(
    series.map((s, index) => ({
      ...s,
      color: s.color || paletteColors[index % paletteColors.length],
      curve: s.curve || 'monotoneX', // Default to smooth curves
    }))
  );

  // Fix xAxis format for MUI X Charts
  let processedXAxis: Array<{
    data: (number | string | Date)[];
    label?: string;
    scaleType: 'band' | 'linear' | 'log' | 'time' | 'utc' | 'point' | 'sqrt' | 'symlog';
  }>;

  if (xAxis && xAxis.length > 0) {
    processedXAxis = xAxis.map(axis => {
      const hasStringData = axis.data && axis.data.some(val => typeof val === 'string');
      const scaleType = axis.scaleType || (hasStringData ? 'point' : 'linear');
      return {
        ...axis,
        scaleType: scaleType as 'band' | 'linear' | 'log' | 'time' | 'utc' | 'point' | 'sqrt' | 'symlog'
      };
    });
  } else {
    // Create default x-axis if none provided
    const dataLength = processedSeries[0].data.length;
    processedXAxis = [{
      data: Array.from({ length: dataLength }, (_, i) => i),
      scaleType: 'linear' as const
    }];
  }

  // Use theme-aware background colors
  const cardBgColor = cardBackgroundColor;
  const ct = getChartTheme(isDarkMode);

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
          {(() => {
            try {
              return (
                <MuiLineChart
                  xAxis={processedXAxis}
                  series={processedSeries}
                  width={chartWidth}
                  height={height}
                  grid={grid}
                  margin={{ ...margin, left: Math.max(margin.left ?? 20, 56) }}
                  yAxis={[{
                    valueFormatter: (v: number) =>
                      Math.abs(v) >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M`
                      : Math.abs(v) >= 1_000 ? `${(v / 1_000).toFixed(0)}K`
                      : String(v),
                  }]}
                  slotProps={{
                    legend: legend
                      ? {
                        direction: 'horizontal' as const,
                        position: { vertical: 'top', horizontal: 'center' } as const,
                      }
                      : undefined,
                  }}
                  sx={buildChartSx(ct, 0, {
                    backgroundColor: backgroundColor || 'transparent',
                  })}
                />
              );
            } catch (error) {
              console.error('[LineChart] Rendering error:', error);
              return (
                <div className="text-center text-zinc-500 dark:text-zinc-400">
                  <div className="text-4xl mb-2">⚠️</div>
                  <div>Chart rendering error</div>
                  <div className="text-xs mt-1 text-red-500">{String(error)}</div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default LineChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'line-chart',
  category: 'charts' as const,
  component: LineChart,
  description: 'Line chart for visualizing trends over time with support for multiple series, curves, areas, visual variants, and color palettes',
  tags: ['chart', 'line', 'trend', 'time-series', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: 'Array<{ data, label?, scaleType? }>',
    series: 'Array<{ data, label?, color?, curve?, showMark?, area? }>',
    width: 'number',
    height: 'number',
    grid: '{ vertical?: boolean, horizontal?: boolean }',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
    variant: 'SurfaceVariant - Visual style: default | gradient | accent | glass | elevated | subtle (default: default)',
    elevation: 'ElevationLevel - Depth level: flat | raised | floating | overlay (default: raised)',
    emphasis: 'EmphasisLevel - Visual emphasis: low | medium | high (default: medium)',
    palette: 'ChartPaletteType - Color palette: default | vibrant | pastel | gradient | monochrome | semantic (default: default)',
    useGradient: 'boolean - Use gradient fills for area charts (default: false)',
    className: 'string - Optional CSS class names',
  },
};
