import React from 'react';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { processSeriesColors } from '../core/utils';
import { getSurfaceClasses, getChartColors } from '@/theme/designTokens';
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
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  description,
  xAxis,
  series,
  width = 800,
  height = 400,
  backgroundColor,
  cardBackgroundColor,
  grid = { horizontal: true, vertical: false },
  legend = true,
  margin = { top: 50, right: 30, bottom: 50, left: 60 },
  variant = 'default',
  elevation = 'raised',
  emphasis: _emphasis = 'medium',
  palette = 'default',
  useGradient: _useGradient = false,
}) => {
  // Get palette colors
  const paletteColors = getChartColors(palette);
  const surfaceClasses = getSurfaceClasses(variant, elevation);

  // Validation and error handling
  if (!series || series.length === 0 || !series[0].data || series[0].data.length === 0) {
    console.warn('[LineChart] No valid series data provided:', { series });
    return (
      <div className={`${surfaceClasses} rounded-xl p-6 my-4 transition-all duration-300`}>
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
        <div className="flex justify-center items-center min-h-[300px] text-text-secondary">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No data available</div>
          </div>
        </div>
      </div>
    );
  }

  // Process series colors with palette
  const processedSeries = processSeriesColors(
    series.map((s, index) => ({
      ...s,
      color: s.color || paletteColors[index % paletteColors.length],
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
  const plotBackgroundColor = backgroundColor || (variant === 'accent' || variant === 'gradient' ? 'transparent' : '#FFFFFF');
  const cardBgColor = cardBackgroundColor;

  return (
    <div
      className={`${surfaceClasses} rounded-xl p-6 my-4 transition-all duration-300`}
      style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
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
          {(() => {
            try {
              return (
                <MuiLineChart
                  xAxis={processedXAxis}
                  series={processedSeries}
                  width={width}
                  height={height}
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
              );
            } catch (error) {
              console.error('[LineChart] Rendering error:', error);
              return (
                <div className="text-center text-text-secondary">
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
  },
};
