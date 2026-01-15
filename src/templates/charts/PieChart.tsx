import React from 'react';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';

interface PieChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Series data for pie slices */
  series: Array<{
    data: Array<{
      id: string | number;
      value: number;
      label?: string;
      color?: string;
    }>;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    cornerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    cx?: number;
    cy?: number;
  }>;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

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

const PieChart: React.FC<PieChartProps> = ({
  title,
  description,
  series,
  width = 800,
  height = 400,
  legend = true,
  margin = { top: 50, right: 100, bottom: 50, left: 100 },
}) => {
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

      <div className="flex justify-center items-center">
        <MuiPieChart
          series={series}
          width={width}
          height={height}
          margin={margin}
          slotProps={{
            legend: legend
              ? {
                  position: { vertical: 'middle', horizontal: 'end' },
                }
              : undefined,
          }}
          sx={{
            '& .MuiChartsLegend-series text': {
              fill: '#374151 !important',
              fontSize: '14px',
              fontWeight: 500,
            },
            '& .MuiChartsLegend-mark': {
              rx: 2,
            },
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'pie-chart',
  category: 'charts' as const,
  component: PieChart,
  description: 'Pie chart for showing proportional data distribution with support for donut style and custom styling',
  tags: ['chart', 'pie', 'donut', 'proportion', 'percentage', 'data-visualization'],
  propTypes: {
    title: 'string',
    series: 'Array<{ data, innerRadius?, outerRadius?, paddingAngle?, cornerRadius? }>',
    width: 'number',
    height: 'number',
    legend: 'boolean',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
