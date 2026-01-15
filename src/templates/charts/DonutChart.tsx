import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface DonutChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Series data for donut slices */
  data: Array<{
    id: string | number;
    value: number;
    label?: string;
    color?: string;
  }>;

  /** Inner radius percentage (creates the donut hole) */
  innerRadius?: number;

  /** Outer radius */
  outerRadius?: number;

  /** Padding angle between slices */
  paddingAngle?: number;

  /** Corner radius for slices */
  cornerRadius?: number;

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Show legend */
  legend?: boolean;

  /** Show center label */
  centerLabel?: string;

  /** Margin around chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  description,
  data,
  innerRadius = 60,
  outerRadius = 100,
  paddingAngle = 2,
  cornerRadius = 4,
  width = 800,
  height = 400,
  legend = true,
  centerLabel,
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

      <div className="flex justify-center items-center relative">
        <PieChart
          series={[
            {
              data,
              innerRadius,
              outerRadius,
              paddingAngle,
              cornerRadius,
            },
          ]}
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
        {centerLabel && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-2xl font-bold text-text-primary">{centerLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'donut-chart',
  category: 'charts' as const,
  component: DonutChart,
  description: 'Donut chart (pie chart with center hole) for displaying proportional data with optional center label',
  tags: ['chart', 'donut', 'pie', 'proportion', 'percentage', 'data-visualization'],
  propTypes: {
    title: 'string',
    data: 'Array<{ id, value, label?, color? }>',
    innerRadius: 'number',
    outerRadius: 'number',
    paddingAngle: 'number',
    cornerRadius: 'number',
    width: 'number',
    height: 'number',
    legend: 'boolean',
    centerLabel: 'string',
    margin: '{ top?, right?, bottom?, left? }',
  },
};
