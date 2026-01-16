import React from 'react';

interface SankeyChartProps {
  /** Chart title */
  title?: string;

  /** Optional description text */
  description?: string;

  /** Node definitions */
  nodes: Array<{
    name: string;
  }>;

  /** Link/flow definitions */
  links: Array<{
    source: number | string; // Node index or name
    target: number | string; // Node index or name
    value: number;
  }>;

  /** Chart height */
  height?: number;
}

const SankeyChart: React.FC<SankeyChartProps> = ({
  title,
  description,
  nodes,
  links,
  height = 400,
}) => {
  // Validate
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return (
      <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
        {title && (
          <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-gray-400">
          <p className="text-sm">No nodes data for Sankey diagram</p>
        </div>
      </div>
    );
  }

  if (!links || !Array.isArray(links) || links.length === 0) {
    return (
      <div className="card rounded-card p-6 my-4 hover:shadow-hover transition-all duration-300">
        {title && (
          <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-gray-400">
          <p className="text-sm">No links data for Sankey diagram</p>
        </div>
      </div>
    );
  }

  // Helper to get node name by index or name
  const getNodeName = (identifier: number | string): string => {
    if (typeof identifier === 'number') {
      return nodes[identifier]?.name || `Node ${identifier}`;
    }
    return identifier;
  };

  // Calculate total flow for each node
  const nodeFlows = new Map<string, { inflow: number; outflow: number }>();

  nodes.forEach(node => {
    nodeFlows.set(node.name, { inflow: 0, outflow: 0 });
  });

  links.forEach(link => {
    const sourceName = getNodeName(link.source);
    const targetName = getNodeName(link.target);
    const value = Number(link.value) || 0;

    const sourceFlow = nodeFlows.get(sourceName) || { inflow: 0, outflow: 0 };
    const targetFlow = nodeFlows.get(targetName) || { inflow: 0, outflow: 0 };

    sourceFlow.outflow += value;
    targetFlow.inflow += value;

    nodeFlows.set(sourceName, sourceFlow);
    nodeFlows.set(targetName, targetFlow);
  });

  // Find max value for scaling
  const maxValue = Math.max(...links.map(l => Number(l.value) || 0));

  // Color palette
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

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

      {/* Flow visualization */}
      <div className="space-y-6" style={{ minHeight: `${height}px` }}>
        {/* Nodes summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node, index) => {
            const flow = nodeFlows.get(node.name) || { inflow: 0, outflow: 0 };
            const totalFlow = Math.max(flow.inflow, flow.outflow);
            const color = colors[index % colors.length];

            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200"
                style={{ borderColor: color, borderWidth: '2px' }}
              >
                <div className="font-semibold text-text-primary mb-2" style={{ color }}>
                  {node.name}
                </div>
                <div className="text-sm space-y-1">
                  {flow.inflow > 0 && (
                    <div className="text-text-secondary">
                      Inflow: <span className="font-medium text-text-primary">{flow.inflow.toFixed(2)}</span>
                    </div>
                  )}
                  {flow.outflow > 0 && (
                    <div className="text-text-secondary">
                      Outflow: <span className="font-medium text-text-primary">{flow.outflow.toFixed(2)}</span>
                    </div>
                  )}
                  {totalFlow > 0 && (
                    <div className="text-text-secondary">
                      Total: <span className="font-medium text-text-primary">{totalFlow.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Flows/Links table */}
        <div>
          <h4 className="text-lg font-semibold text-text-primary mb-3">Flows</h4>
          <div className="space-y-2">
            {links.map((link, index) => {
              const sourceName = getNodeName(link.source);
              const targetName = getNodeName(link.target);
              const value = Number(link.value) || 0;
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

              // Find source node index for color
              const sourceIndex = nodes.findIndex(n => n.name === sourceName);
              const color = colors[sourceIndex % colors.length];

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      <span className="font-medium text-text-primary">{sourceName}</span>
                      {' → '}
                      <span className="font-medium text-text-primary">{targetName}</span>
                    </span>
                    <span className="font-semibold text-text-primary">{value.toFixed(2)}</span>
                  </div>
                  <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SankeyChart;

// Component metadata for auto-registration
export const metadata = {
  name: 'sankey-chart',
  category: 'charts' as const,
  component: SankeyChart,
  description: 'Sankey diagram for visualizing flow between nodes (rendered as table with bars)',
  tags: ['chart', 'sankey', 'flow', 'network', 'data-visualization'],
  propTypes: {
    title: 'string',
    description: 'string',
    nodes: 'Array<{ name }>',
    links: 'Array<{ source, target, value }>',
    height: 'number',
  },
};
