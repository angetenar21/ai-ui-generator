import React, { useRef, useState, useEffect } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import type { SurfaceVariant, ElevationLevel , ChartPaletteType} from '../core/types';
import { useAppStore } from '@/store/appStore';
import { getSurfaceClasses , getChartColors} from '@/theme/designTokens';

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

  variant?: SurfaceVariant;
  elevation?: ElevationLevel;

  palette?: ChartPaletteType;
}

const SankeyChart: React.FC<SankeyChartProps> = ({
  title,
  description,
  nodes,
  links,
  height = 400,
  variant = 'transparent',
  elevation = 'raised',
  palette = 'default'}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(height);

  // Detect dark mode
  const theme = useAppStore(state => state.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
      <div className="w-full bg-transparent dark:bg-transparent border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-6">
        {title && (
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">No nodes data for Sankey diagram</p>
        </div>
      </div>
    );
  }

  if (!links || !Array.isArray(links) || links.length === 0) {
    return (
      <div className="w-full bg-transparent dark:bg-transparent border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-6">
        {title && (
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        <div className="text-center text-zinc-500 dark:text-zinc-400">
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
    '#f59e0b', // teal
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#10B981', // emerald
    '#06b6d4', // cyan
    '#6366f1', // orange
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
  const getLinkColor = (sourceIndex: number) => {
    const baseColor = colors[sourceIndex % colors.length];
    return isDarkMode ? `${baseColor}80` : `${baseColor}60`; // 50% opacity
  };

  // Custom link rendering with gradient
  const renderLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
    const sourceIndex = sankyData.links[index]?.source || 0;
    const linkColor = getLinkColor(sourceIndex);

    return (
      <path
        key={`link-${index}`}
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        fill="none"
        stroke={linkColor}
        strokeWidth={Math.max(1, linkWidth)}
        strokeOpacity={isDarkMode ? 0.6 : 0.4}
        className="hover:opacity-100 transition-opacity"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-transparent dark:bg-transparent border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-6 transition-all duration-300"
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-display font-semibold text-zinc-900 dark:text-white mb-2 tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
                  nodePadding={10}
                  margin={{ top: 10, right: 150, bottom: 10, left: 60 }}
                  link={renderLink}
                >
                  <Tooltip
                    contentStyle={{
              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '12px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
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
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Unable to render Sankey diagram</span>
              </div>
            );
          }
        })()}
      </div>

      {/* Flow Summary */}
      <div className="mt-6 pt-6 border-t border-zinc-200/60 dark:border-zinc-700/60">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Flow Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {normalizedLinks.map((link, index) => (
            <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl border border-zinc-200/40 dark:border-zinc-600/40">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                <span className="font-medium">{sankyNodes[link.source].name}</span>
                <span className="mx-1">→</span>
                <span className="font-medium">{sankyNodes[link.target].name}</span>
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">
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
