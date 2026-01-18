import React, { useRef, useState, useEffect } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(height);

  // Detect dark mode
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Responsive sizing
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setChartHeight(Math.max(300, height));
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [height]);

  // Validate data
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No nodes data for Sankey diagram</p>
        </div>
      </div>
    );
  }

  if (!links || !Array.isArray(links) || links.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No links data for Sankey diagram</p>
        </div>
      </div>
    );
  }

  // Helper to normalize node identifiers to indices
  const normalizeNodeIdentifier = (identifier: number | string): number => {
    if (typeof identifier === 'number') {
      return identifier;
    }
    return nodes.findIndex(n => n.name === identifier);
  };

  // Convert links to proper format with indices
  const normalizedLinks = links
    .map(link => ({
      source: normalizeNodeIdentifier(link.source),
      target: normalizeNodeIdentifier(link.target),
      value: Number(link.value) || 0,
    }))
    .filter(link => link.source >= 0 && link.target >= 0 && link.value > 0);

  // Color palette for nodes
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#06b6d4', // cyan
    '#6366f1', // indigo
  ];

  // Create node data with colors
  const sankyNodes = nodes.map((node, index) => ({
    name: node.name,
    color: colors[index % colors.length],
  }));

  // Create Sankey data structure
  const sankyData = {
    nodes: sankyNodes,
    links: normalizedLinks,
  };

  // Colors for links (with transparency)
  // const getLinkColor = (sourceIndex: number) => {
  //   const baseColor = colors[sourceIndex % colors.length];
  //   return isDarkMode ? `${baseColor}80` : `${baseColor}60`; // 50% opacity
  // };

  // Custom node rendering
  // const renderNode = (props: any) => {
  //   const { x, y, width, height, index, payload } = props;
  //   const nodeColor = payload.color || '#3b82f6';

  //   return (
  //     <g key={`node-${index}`}>
  //       <rect
  //         x={x}
  //         y={y}
  //         width={width}
  //         height={height}
  //         fill={nodeColor}
  //         rx={4}
  //         className="hover:opacity-80 transition-opacity"
  //       />
  //       <text
  //         x={x + width + 8}
  //         y={y + height / 2}
  //         fill={isDarkMode ? '#e5e7eb' : '#1f2937'}
  //         fontSize="12"
  //         dominantBaseline="middle"
  //         fontWeight="500"
  //       >
  //         {payload.name}
  //       </text>
  //     </g>
  //   );
  // };

  // Custom link rendering with gradient
  // const renderLink = (props: any) => {
  //   const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
  //   const sourceIndex = sankyData.links[index]?.source || 0;
  //   const linkColor = getLinkColor(sourceIndex);

  //   return (
  //     <path
  //       key={`link-${index}`}
  //       d={`
  //         M${sourceX},${sourceY}
  //         C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
  //       `}
  //       fill="none"
  //       stroke={linkColor}
  //       strokeWidth={Math.max(1, linkWidth)}
  //       strokeOpacity={isDarkMode ? 0.6 : 0.4}
  //       className="hover:opacity-100 transition-opacity"
  //     />
  //   );
  // };

  return (
    <div
      ref={containerRef}
      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Sankey Diagram */}
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
        {(() => {
          try {
            return (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <Sankey
                  data={sankyData}
                  nodePadding={80}
                  margin={{ top: 20, right: 200, bottom: 20, left: 20 }}
                >
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      color: isDarkMode ? '#e5e7eb' : '#1f2937',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                    cursor={{ fill: isDarkMode ? '#374151' : '#f3f4f6', opacity: 0.3 }}
                    labelStyle={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}
                  />
                </Sankey>
              </ResponsiveContainer>
            );
          } catch (error) {
            console.warn('[SankeyChart] Render error:', error);
            return (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Unable to render Sankey diagram</span>
              </div>
            );
          }
        })()}
      </div>

      {/* Flow Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Flow Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {normalizedLinks.map((link, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">{sankyNodes[link.source].name}</span>
                <span className="mx-1">→</span>
                <span className="font-medium">{sankyNodes[link.target].name}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {link.value.toFixed(2)}
              </div>
            </div>
          ))}
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
