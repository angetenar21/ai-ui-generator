import React, { useRef, useState, useEffect } from 'react';

interface HeatMapChartProps {
  /** Chart title */
  title?: string;

  /** Chart description */
  description?: string;

  /** X-axis labels */
  xAxis?: {
    data: string[];

    children?: React.ReactNode;
    renderChild?: (child: any) => React.ReactNode;
  };

  /** Y-axis labels */
  yAxis?: {
    data: string[];
  };

  /** Series data with heatmap values */
  series: Array<{
    name?: string;
    data: Array<[number | string, number | string, number]>; // [x, y, value]
  }>;

  /** Visual mapping configuration */
  visualMap?: {
    min?: number;
    max?: number;
    inRange?: {
      color?: string[];
    };
  };

  /** Chart width (ignored - always responsive) */
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
  height = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Validate
  if (!series || !Array.isArray(series) || series.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        {title && <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>}
        <div className="flex items-center justify-center h-32 text-zinc-400 text-sm">
          No heatmap data provided
        </div>
      </div>
    );
  }

  const xLabels = xAxis?.data || [];
  const yLabels = yAxis?.data || [];
  const firstSeries = series[0];

  if (!firstSeries?.data?.length || xLabels.length === 0 || yLabels.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        {title && <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>}
        <div className="flex items-center justify-center h-32 text-zinc-400 text-sm">
          Requires xAxis.data, yAxis.data, and series data
        </div>
      </div>
    );
  }

  // Build grid — support both numeric index and string label references
  const grid: Map<string, number> = new Map();
  firstSeries.data.forEach((d) => {
    if (!Array.isArray(d) || d.length < 3) return;
    const [rawX, rawY, value] = d;
    let xKey: string;
    let yKey: string;

    if (typeof rawX === 'number') {
      xKey = xLabels[rawX] ?? String(rawX);
    } else {
      xKey = String(rawX);
    }

    if (typeof rawY === 'number') {
      yKey = yLabels[rawY] ?? String(rawY);
    } else {
      yKey = String(rawY);
    }

    grid.set(`${xKey}|||${yKey}`, Number(value) || 0);
  });

  // Find min/max for color scaling
  const allValues = Array.from(grid.values());
  const minValue = visualMap?.min ?? (allValues.length > 0 ? Math.min(...allValues) : 0);
  const maxValue = visualMap?.max ?? (allValues.length > 0 ? Math.max(...allValues) : 1);

  // Smooth color interpolation
  const defaultColors = visualMap?.inRange?.color || ['#dbeafe', '#3b82f6', '#1d4ed8'];

  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
  };

  const getColor = (value: number): string => {
    const normalized = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
    const colors = defaultColors;
    const scaled = normalized * (colors.length - 1);
    const lo = Math.floor(scaled);
    const hi = Math.min(lo + 1, colors.length - 1);
    const t = scaled - lo;
    const [r1, g1, b1] = hexToRgb(colors[lo]);
    const [r2, g2, b2] = hexToRgb(colors[hi]);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  };

  const getTextColor = (value: number): string => {
    const normalized = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
    return normalized > 0.55 ? '#ffffff' : '#374151';
  };

  // Responsive cell size
  const yLabelWidth = 80;
  const availableWidth = containerWidth > 0 ? containerWidth - yLabelWidth - 16 : 400;
  const cellWidth = Math.max(30, availableWidth / xLabels.length);
  const cellHeight = Math.max(28, Math.min(cellWidth * 0.7, height / yLabels.length));
  const showValueText = cellWidth >= 36;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl min-w-0 overflow-x-auto">
      {(title || description) && (
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          {title && <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>}
          {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>}
        </div>
      )}

      <div className="p-4" ref={containerRef}>
        <div className="overflow-x-auto">
          <div style={{ display: 'flex', minWidth: 'fit-content' }}>
            {/* Y-axis labels */}
            <div style={{ width: yLabelWidth, flexShrink: 0 }}>
              <div style={{ height: 32 }} /> {/* Header row spacer */}
              {yLabels.map((yLabel, y) => (
                <div
                  key={y}
                  style={{
                    height: cellHeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: 10,
                    fontSize: '11px',
                    color: '#9ca3af',
                    marginBottom: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {yLabel}
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* X-axis labels */}
              <div style={{ display: 'flex', marginBottom: 4, height: 32 }}>
                {xLabels.map((xLabel, i) => (
                  <div
                    key={i}
                    style={{
                      width: cellWidth,
                      textAlign: 'center',
                      fontSize: '10px',
                      color: '#9ca3af',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: 4,
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ maxWidth: cellWidth - 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {xLabel}
                    </span>
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              {yLabels.map((yLabel, y) => (
                <div key={y} style={{ display: 'flex', marginBottom: 2 }}>
                  {xLabels.map((xLabel, x) => {
                    const cellValue = grid.get(`${xLabel}|||${yLabel}`) ?? grid.get(`${x}|||${y}`) ?? 0;
                    const bgColor = getColor(cellValue);
                    const textColor = getTextColor(cellValue);
                    return (
                      <div
                        key={x}
                        style={{
                          width: cellWidth,
                          height: cellHeight,
                          backgroundColor: bgColor,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: textColor,
                          fontWeight: 600,
                          cursor: 'pointer',
                          flexShrink: 0,
                          marginRight: 2,
                          transition: 'opacity 0.15s ease',
                        }}
                        title={`${xLabel} × ${yLabel}: ${cellValue}`}
                      >
                        {showValueText && cellValue !== 0 ? cellValue.toFixed(0) : ''}
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
          <span className="text-xs text-zinc-400">Low</span>
          <div
            style={{
              width: 120,
              height: 12,
              borderRadius: 6,
              background: `linear-gradient(to right, ${defaultColors.join(', ')})`,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          />
          <span className="text-xs text-zinc-400">High</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMapChart;

export const metadata = {
  name: 'heatmap-chart',
  category: 'charts' as const,
  component: HeatMapChart,
  description: 'Responsive heat map visualization for 2D data density. Shows values with smooth color gradient intensity.',
  tags: ['chart', 'heatmap', 'density', '2d', 'matrix'],
  propTypes: {
    title: 'string',
    description: 'string',
    xAxis: '{ data: string[] }',
    yAxis: '{ data: string[] }',
    series: 'Array<{ data: [[xIndex|label, yIndex|label, value], ...] }>',
    visualMap: '{ min?, max?, inRange?: { color?: string[] } }',
    height: 'number',
  },
};
