import React from 'react';
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
    <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
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

      <div className="flex justify-center items-center">
        <ChartContainer
          series={allSeries}
          xAxis={xAxisConfig}
          yAxis={yAxisConfig}
          width={width}
          height={height}
          colors={colorPalette}
          margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
          sx={{
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
            '& .MuiChartsAxis-label': {
              fill: '#374151',
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
