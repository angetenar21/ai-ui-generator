import React, { useState, useRef, useEffect } from 'react';

interface Column {
  id: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: Row) => React.ReactNode;
}

interface Row {
  id: string;
  [key: string]: any;
}

interface VirtualizedTableProps {
  title?: string;
  columns: Column[];
  rows: Row[];
  rowHeight?: number;
  overscan?: number;
  onRowClick?: (row: Row) => void;
  stickyHeader?: boolean;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  title,
  columns,
  rows,
  rowHeight = 48,
  overscan = 5,
  onRowClick,
  stickyHeader = true,
}) => {
  const safeCols = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  const renderCellValue = (val: any): React.ReactNode => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? '✓' : '✗';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', ');
    if (typeof val === 'object') {
      if (val.label !== undefined) {
        const bg = val.color ? `${val.color}20` : '#F3F4F6';
        const text = val.color || '#374151';
        return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, backgroundColor: bg, color: text, border: `1px solid ${val.color || '#E5E7EB'}` }}>{val.label}</span>;
      }
      try { return JSON.stringify(val); } catch { return '[object]'; }
    }
    return String(val);
  };
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(Math.min(600, window.innerHeight - rect.top - 100));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate visible range
  const totalHeight = safeRows.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    safeRows.length - 1,
    Math.floor((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const visibleRows = safeRows.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * rowHeight;

  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 my-4">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-white">
            {title}
          </h3>
          <div className="text-sm text-gray-400">
            {safeRows.length.toLocaleString()} rows (virtualized)
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="overflow-auto border border-gray-700/50 rounded-lg"
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        {/* Sticky Header */}
        {stickyHeader && (
          <div className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm">
            <div className="flex border-b border-gray-700">
              {safeCols.map((column) => (
                <div
                  key={column.id}
                  className={`
                    px-4 py-3 text-sm font-semibold text-gray-300
                    ${getAlignment(column.align)}
                  `}
                  style={{
                    width: column.width ? `${column.width}px` : 'auto',
                    flex: column.width ? undefined : 1,
                  }}
                >
                  {column.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Virtualized content container */}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {/* Visible rows */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              width: '100%',
            }}
          >
            {visibleRows.map((row, index) => {
              const actualIndex = startIndex + index;
              const isEven = actualIndex % 2 === 0;

              return (
                <div
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    flex items-center
                    ${isEven ? 'bg-gray-800/20' : 'bg-transparent'}
                    hover:bg-gray-700/30
                    transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                    border-b border-gray-700/30
                  `}
                  style={{ height: `${rowHeight}px` }}
                >
                  {safeCols.map((column) => (
                    <div
                      key={column.id}
                      className={`
                        px-4 text-sm text-gray-200
                        ${getAlignment(column.align)}
                        truncate
                      `}
                      style={{
                        width: column.width ? `${column.width}px` : 'auto',
                        flex: column.width ? undefined : 1,
                      }}
                    >
                      {column.render
                        ? column.render(row[column.id], row)
                        : renderCellValue(row[column.id])}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {safeRows.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No data to display
          </div>
        )}
      </div>

      {/* Performance info */}
      <div className="mt-4 text-xs text-gray-500 flex items-center gap-4">
        <div>
          Rendering {visibleRows.length} of {safeRows.length} rows
        </div>
        <div>
          Viewport: {startIndex + 1}-{endIndex + 1}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Virtual scrolling active</span>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedTable;

export const metadata = {
  name: 'virtualized-table',
  category: 'data-display' as const,
  component: VirtualizedTable,
  description: 'High-performance table with virtual scrolling for large datasets',
  tags: ['table', 'virtual', 'performance', 'large-data', 'scroll', 'optimized'],
  propTypes: {
    title: 'string',
    columns: 'Column[]',
    rows: 'Row[]',
    rowHeight: 'number',
    overscan: 'number',
    onRowClick: '(row: Row) => void',
    stickyHeader: 'boolean',
  },
};
