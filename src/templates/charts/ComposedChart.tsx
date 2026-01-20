import React, { useRef, useState, useEffect } from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

interface ComposedChartSeries {
  name: string;
  type: 'bar' | 'line';
  data: number[];
  color?: string;
  yAxisIndex?: number;
}

interface ComposedChartProps {
  title?: string;
  description?: string;
  xAxis?: Array<{
    data: (number | string | Date)[];
    label?: string;
    scaleType?: 'band' | 'linear' | 'log' | 'time';
  }>;
  yAxis?: Array<{
    type?: string;
    name?: string;
    position?: 'left' | 'right';
  }>;
  series: ComposedChartSeries[];
  width?: number;
  height?: number;
  legend?: boolean;
}

const ComposedChart: React.FC<ComposedChartProps> = ({
  title,
  description,
  xAxis = [],
  yAxis = [],
  series,
  width = 800,
  height = 400,
  legend = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(width);

  useEffect(() => {
    const updateWidth = () => {
      const measuredWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = measuredWidth > 0 ? measuredWidth - 16 : undefined;
      const fallbackWidth = width;

      let nextWidth = fallbackWidth;
      if (typeof maxWidth === 'number') {
        nextWidth = Math.min(fallbackWidth, maxWidth);
      }

      const minWidth = typeof maxWidth === 'number' ? Math.min(320, maxWidth) : 320;
      const maxWidthClamp = typeof maxWidth === 'number' ? maxWidth : 1600;

      setChartWidth(Math.max(minWidth, Math.min(nextWidth, maxWidthClamp)));
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [width]);

  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  // Separate bar and line series
  const barSeries = series.filter(s => s.type === 'bar').map(s => ({
    type: 'bar' as const,
    data: s.data,
    label: s.name,
    color: s.color || '#8b5cf6',
    yAxisKey: s.yAxisIndex !== undefined ? `yAxis-${s.yAxisIndex}` : 'yAxis-0',
  }));

  const lineSeries = series.filter(s => s.type === 'line').map(s => ({
    type: 'line' as const,
    data: s.data,
    label: s.name,
    color: s.color || '#3b82f6',
    curve: 'linear' as const,
    showMark: false,
    yAxisKey: s.yAxisIndex !== undefined ? `yAxis-${s.yAxisIndex}` : 'yAxis-0',
  }));

  const allSeries = [...barSeries, ...lineSeries];

  // Extract colors for MUI X-Charts (it uses a color palette, not individual series colors)
  const colorPalette = allSeries.map(s => s.color);

  // Configure x-axis
  const xAxisConfig = xAxis.map((axis, index) => ({
    id: `xAxis-${index}`,
    data: axis.data,
    scaleType: axis.scaleType || 'band' as const,
    label: axis.label,
  }));

  // Configure y-axes
  const yAxisConfig = yAxis.map((axis, index) => ({
    id: `yAxis-${index}`,
    label: axis.name,
    position: axis.position || (index === 0 ? 'left' : 'right') as 'left' | 'right',
  }));

  // If no y-axis configured, create default ones
  if (yAxisConfig.length === 0) {
    const hasMultipleYAxes = series.some(s => s.yAxisIndex === 1);
    if (hasMultipleYAxes) {
      yAxisConfig.push(
        { id: 'yAxis-0', label: undefined, position: 'left' as const },
        { id: 'yAxis-1', label: undefined, position: 'right' as const }
      );
    } else {
      yAxisConfig.push({ id: 'yAxis-0', label: undefined, position: 'left' as const });
    }
  }

  return (
    <div className="card rounded-card p-6 hover:shadow-hover transition-all duration-300">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <div ref={containerRef} className="flex justify-center items-center w-full overflow-x-auto">
        <ChartContainer
          series={allSeries}
          xAxis={xAxisConfig}
          yAxis={yAxisConfig}
          width={chartWidth}
          height={height}
          colors={colorPalette}
          margin={{ top: 50, right: 30, bottom: 50, left: 30 }}
          sx={{
            '& .MuiChartsAxis-line': {
              stroke: isDarkMode ? '#6B7280' : '#6B7280',
              strokeWidth: 1.5,
            },
            '& .MuiChartsAxis-tick': {
              stroke: isDarkMode ? '#6B7280' : '#6B7280',
              strokeWidth: 1,
            },
            '& .MuiChartsAxis-tickLabel': {
              fill: isDarkMode ? '#D1D5DB' : '#374151',
              fontSize: '13px',
              fontWeight: 500,
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
              fill: `${isDarkMode ? '#D1D5DB' : '#374151'} !important`,
              fontSize: '12px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-mark': {
              rx: 2,
              width: '12px',
              height: '12px',
            },
            '& .MuiChartsGrid-line': {
              stroke: isDarkMode ? '#374151' : '#E5E7EB',
              strokeDasharray: '4 4',
              opacity: 0.8,
            },
            '& .MuiChartsAxis-label': {
              fill: isDarkMode ? '#D1D5DB' : '#374151',
              fontSize: '13px',
              fontWeight: 500,
            },
          }}
        >
          <ChartsGrid horizontal vertical={false} />
          <BarPlot />
          <LinePlot />
          <MarkPlot />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsAxisHighlight x="band" />
          <ChartsTooltip />
          {legend && <ChartsLegend />}
        </ChartContainer>
      </div>
    </div>
  );
};

export default ComposedChart;

export const metadata = {
  name: 'composed-chart',
  category: 'charts' as const,
  component: ComposedChart,
  description: 'Chart combining bar and line series with dual y-axes support',
  tags: ['chart', 'composed', 'mixed', 'bar', 'line', 'dual-axis'],
};
