import React from 'react';
import { ScatterChart as MuiScatterChart } from '@mui/x-charts/ScatterChart';

interface ScatterChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** X-axis configuration */
  xAxis?: Array<{
    min?: number;
    max?: number;
    label?: string;
  }>;

  /** Y-axis configuration */
  yAxis?: Array<{
    min?: number;
    max?: number;
    label?: string;
  }>;

  /** Series data for scatter points */
  series: Array<{
    data: Array<{
      x: number;
      y: number;
      id?: string | number;
    }> | Array<[number, number]>;
    label?: string;
    color?: string;
    markerSize?: number;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

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
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  title,
  description,
  xAxis,
  yAxis,
  series,
  width = 600,
  height = 400,
  grid = { horizontal: true, vertical: true },
  legend = true,
  margin = { top: 50, right: 30, bottom: 50, left: 60 },
}) => {
  // Validation and error handling
  if (!series || series.length === 0 || !series[0].data || series[0].data.length === 0) {
    console.warn('[ScatterChart] No valid series data provided:', { series });
    return (
      <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
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

  // Process axis configuration to handle both 'name' and 'label' properties
  const processedXAxis = xAxis?.map(axis => ({
    ...axis,
    label: axis.label || (axis as any).name || undefined,
  }));

  const processedYAxis = yAxis?.map(axis => ({
    ...axis,
    label: axis.label || (axis as any).name || undefined,
  }));

  // Transform series data to handle different formats
  const processedSeries = series.map((s, index) => {
    let processedData: Array<{ x: number; y: number; id: string | number }>;

    // Check if data is in [x, y] array format or {x, y} object format
    if (s.data && s.data.length > 0) {
      const firstItem = s.data[0];
      if (Array.isArray(firstItem)) {
        // Convert [x, y] format to {x, y, id} format
        processedData = s.data.map((point: any, pointIndex: number) => ({
          x: point[0],
          y: point[1],
          id: `${index}-${pointIndex}`,
        }));
      } else if (typeof firstItem === 'object' && 'x' in firstItem && 'y' in firstItem) {
        // Already in correct {x, y} format
        processedData = s.data.map((point: any, pointIndex: number) => ({
          x: point.x,
          y: point.y,
          id: point.id || `${index}-${pointIndex}`,
        }));
      } else {
        console.warn('[ScatterChart] Unsupported data format:', firstItem);
        processedData = [];
      }
    } else {
      processedData = [];
    }

    return {
      ...s,
      data: processedData,
      label: s.label || `Series ${index + 1}`,
    };
  });

  // Debug logging
  console.log('[ScatterChart] Rendering with data:', {
    title,
    xAxis: processedXAxis,
    yAxis: processedYAxis,
    series: processedSeries,
    width,
    height
  });

  return (
    <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
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
      <div className="flex justify-center items-center min-h-[200px] w-full">
        {(() => {
          try {
            // Constrain width to be responsive
            const constrainedWidth = Math.min(width, 800);

            return (
              <MuiScatterChart
                xAxis={processedXAxis}
                yAxis={processedYAxis}
                series={processedSeries}
                width={constrainedWidth}
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
                  maxWidth: '100%',
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
                    fontWeight: 500,
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
            console.error('[ScatterChart] Error rendering chart:', error);
            return (
              <div className="flex justify-center items-center min-h-[300px] text-text-secondary">
                <div className="text-center">
                  <div className="text-4xl mb-2">⚠️</div>
                  <div>Error rendering chart</div>
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default ScatterChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'scatter-chart',
  category: 'charts' as const,
  component: ScatterChart,
  description: 'Scatter chart for visualizing correlation between two variables with customizable markers',
  tags: ['chart', 'scatter', 'correlation', 'xy-plot', 'data-visualization'],
  propTypes: {
    title: 'string',
    xAxis: 'Array<{ min?, max?, label? }>',
    yAxis: 'Array<{ min?, max?, label? }>',
    series: 'Array<{ data: Array<{x, y, id?}>, label?, color?, markerSize? }>',
    width: 'number',
    height: 'number',
    grid: '{ vertical?: boolean, horizontal?: boolean }',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
