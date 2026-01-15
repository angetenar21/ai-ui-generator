import React from 'react';

interface HeatMapChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** X-axis labels */
  xAxis?: {
    data: string[];
  };

  /** Y-axis labels */
  yAxis?: {
    data: string[];
  };

  /** Series data with heatmap values */
  series: Array<{
    name?: string;
    data: Array<[number, number, number]>; // [x, y, value]
  }>;

  /** Visual mapping configuration */
  visualMap?: {
    min?: number;
    max?: number;
    inRange?: {
      color?: string[];
    };
  };

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;
}

const HeatMapChart: React.FC<HeatMapChartProps> = ({
  title,
  description,
  xAxis,
  yAxis,
  series,
  visualMap,
  width = 800,
  height = 400,
}) => {
  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        <div className="text-center text-gray-400">
          <p className="text-sm">No series data for heatmap</p>
        </div>
      </div>
    );
  }

  const xLabels = xAxis?.data || [];
  const yLabels = yAxis?.data || [];
  const firstSeries = series[0];

  // Find min/max for color scaling
  const values = firstSeries.data.map((d) => (Array.isArray(d) && d.length >= 3 ? Number(d[2]) || 0 : 0));
  const minValue = visualMap?.min ?? Math.min(...values);
  const maxValue = visualMap?.max ?? Math.max(...values);

  // Color scale
  const getColor = (value: number): string => {
    const colors = visualMap?.inRange?.color || ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];
    const normalized = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
    const index = Math.min(Math.floor(normalized * colors.length), colors.length - 1);
    return colors[index];
  };

  // Build grid
  const grid: { [key: string]: number } = {};
  firstSeries.data.forEach((d) => {
    if (Array.isArray(d) && d.length >= 3) {
      const [x, y, value] = d;
      grid[`${x}-${y}`] = Number(value) || 0;
    }
  });

  const cellWidth = width / (xLabels.length || 10);
  const cellHeight = height / (yLabels.length || 10);

  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-2xl p-6 my-4">
      {title && <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-400 mb-4 text-center">{description}</p>
      )}

      <div className="overflow-x-auto">
        <div style={{ display: 'flex', minWidth: 'fit-content' }}>
          {/* Y-axis labels */}
          <div style={{ width: 80, flexShrink: 0 }}>
            {/* Empty space for top-left corner */}
            <div style={{ height: 30, marginBottom: 8 }} />
            {/* Y-axis labels */}
            {yLabels.map((yLabel, y) => (
              <div
                key={y}
                style={{
                  height: cellHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 8,
                  fontSize: '11px',
                  color: '#9ca3af',
                  marginBottom: 2,
                }}
              >
                {yLabel}
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* X-axis labels */}
            <div style={{ display: 'flex', marginBottom: 8, height: 30 }}>
              {xLabels.map((label, i) => (
                <div
                  key={i}
                  style={{
                    width: cellWidth,
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {yLabels.map((yLabel, y) => (
              <div key={y} style={{ display: 'flex', marginBottom: 2 }}>
                {xLabels.map((xLabel, x) => {
                  const value = grid[`${x}-${y}`] ?? 0;
                  return (
                    <div
                      key={x}
                      style={{
                        width: cellWidth,
                        height: cellHeight,
                        backgroundColor: getColor(value),
                        border: '1px solid #374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      title={`${xLabel} - ${yLabel}: ${value.toFixed(2)}`}
                    >
                      {value.toFixed(1)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 gap-2">
        <span className="text-xs text-gray-400">Low</span>
        <div className="flex gap-1">
          {(visualMap?.inRange?.color || ['#3b82f6', '#8b5cf6', '#ec4899', '#ef4444']).map((color, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 15,
                backgroundColor: color,
                border: '1px solid #374151',
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">High</span>
      </div>
    </div>
  );
};

export default HeatMapChart;

export const metadata = {
  name: 'heatmap-chart',
  category: 'charts' as const,
  component: HeatMapChart,
  description: 'Heat map visualization for 2D data density. Shows values with color intensity.',
  tags: ['chart', 'heatmap', 'density', '2d'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: '{ data: string[] }',
    yAxis: '{ data: string[] }',
    series: 'Array<{ data: [[x, y, value], ...] }>',
    visualMap: '{ min?, max?, inRange?: { color?: string[] } }',
    width: 'number',
    height: 'number',
  },
};
