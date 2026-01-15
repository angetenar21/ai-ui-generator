import React from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

interface SparklineChartProps {
  /** Chart title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Data points */
  data: number[];

  /** Chart width */
  width?: number;

  /** Chart height */
  height?: number;

  /** Line color */
  color?: string;

  /** Show area under the line */
  area?: boolean;

  /** Show tooltip */
  showTooltip?: boolean;

  /** Curve type */
  curve?: 'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step';
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  title,
  description,
  data,
  width = 200,
  height = 80,
  color = '#F97316',
  area = false,
  showTooltip = true,
  curve = 'linear',
}) => {
  return (
    <div className="card border hover:shadow-hover transition-all duration-300 rounded-card p-4 my-2 inline-block">
      {(title || description) && (
        <div className="mb-2">
          {title && (
            <h4 className="text-sm font-display font-semibold text-text-primary mb-1">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}

      <SparkLineChart
        data={data}
        width={width}
        height={height}
        color={color}
        area={area}
        showTooltip={showTooltip}
        curve={curve}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        sx={{
          '& .MuiLineElement-root': {
            strokeWidth: 2,
          },
          '& .MuiAreaElement-root': {
            fillOpacity: 0.3,
          },
        }}
      />
    </div>
  );
};

export default SparklineChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'sparkline-chart',
  category: 'charts' as const,
  component: SparklineChart,
  description: 'Compact sparkline chart for displaying trends in small spaces, perfect for dashboards',
  tags: ['chart', 'sparkline', 'mini', 'trend', 'compact', 'data-visualization'],
  propTypes: {
    title: 'string',
    data: 'number[]',
    width: 'number',
    height: 'number',
    color: 'string',
    area: 'boolean',
    showTooltip: 'boolean',
    curve: "'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'",
  },
};
