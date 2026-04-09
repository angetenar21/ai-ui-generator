import React, { useState, useMemo } from 'react';
import { useData } from '../core/DataContext';
import { RenderNode } from '../core/renderer';

interface DataTableColumn {
  id?: string;
  label?: string;
  field?: string;
  type?: string;
}

interface DataTableRow {
  id?: string;
  [key: string]: any;
}

interface DataTableProps {
  title?: string;
  columns?: string[] | DataTableColumn[];
  rows?: (string | number)[][] | DataTableRow[];
  sortable?: boolean;
  searchable?: boolean;

  /** Context key written by a Select/MultiSelect to filter rows. Matches against filterKey column. */
  filterByContext?: string;
  /** Column name or index to match filterByContext value against (default: first column) */
  filterKey?: string | number;

  /** Show at most this many rows (useful for large datasets) */
  maxRows?: number;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns = [],
  rows = [],
  sortable = false,
  searchable = false,
  filterByContext,
  filterKey,
  maxRows,
}) => {
  const { data } = useData();
  // Normalize columns: handle both string[] and Column[] formats
  const normalizedColumns: string[] = useMemo(() => {
    if (!columns || !Array.isArray(columns)) return [];
    if (columns.length === 0) return [];

    // Check if first element is a string (simple format)
    if (typeof columns[0] === 'string') {
      return columns as string[];
    }

    // Handle Column objects with {id, label, field, type}
    return (columns as DataTableColumn[]).map(col => col.label || col.id || '');
  }, [columns]);

  // Normalize rows: handle both (string|number)[][] and Row[] formats
  const normalizedRows: (string | number)[][] = useMemo(() => {
    if (!rows || !Array.isArray(rows)) return [];
    if (rows.length === 0) return [];

    // Check if first element is an array (simple format)
    if (Array.isArray(rows[0])) {
      return rows as (string | number)[][];
    }

    // Handle Row objects - convert to array of values based on columns
    // Get field names from column definitions
    const columnFields = (columns as DataTableColumn[]).map(col => col.field || col.id || '');

    return (rows as DataTableRow[]).filter(row => row && typeof row === 'object').map((row) => {
      return columnFields.map((field, colIdx) => {
        if (field && row[field] !== undefined) {
          return row[field];
        }
        // Fallback: get value from row using column index as key
        const keys = Object.keys(row);
        const keyByIndex = keys[colIdx];
        if (keyByIndex) {
          return row[keyByIndex];
        }
        return '';
      });
    });
  }, [rows, columns]);

  // Helper function to render cell values (handle objects like avatars and badges)
  const renderCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'string' || typeof value === 'number') return value;

    if (Array.isArray(value)) {
      return value.map((v, i) => (
        <span key={i} style={{ marginRight: 4 }}>{renderCellValue(v)}</span>
      ));
    }

    if (typeof value === 'object') {
      // If it looks like a component spec (e.g. { name: 'badge', templateProps: {...} })
      if (value.name || value.type) {
        return <RenderNode spec={value} />;
      }
      
      // Render avatar/image objects
      if (value.src) {
        return (
          <img
            src={value.src}
            alt={value.name || 'avatar'}
            style={{
              width: value.size || 32,
              height: value.size || 32,
              borderRadius: value.variant === 'circular' ? '50%' : '4px',
              objectFit: 'cover',
              display: 'inline-block',
            }}
          />
        );
      }
      // Render {label, color} objects as colored badge tags
      if (value.label !== undefined) {
        const bg = value.color ? `${value.color}20` : '#F3F4F620';
        const text = value.color || '#374151';
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 8px', borderRadius: 999,
            fontSize: 11, fontWeight: 600,
            backgroundColor: bg, color: text,
            border: `1px solid ${value.color || '#E5E7EB'}`,
          }}>
            {value.label}
          </span>
        );
      }
      try { return JSON.stringify(value); } catch { return '[object]'; }
    }

    return String(value);
  };

  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (columnIndex: number) => {
    if (!sortable) return;

    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  let displayRows = [...normalizedRows];

  // Filter by DataContext value (dropdown-driven filtering)
  if (filterByContext && data) {
    const contextValue = data[filterByContext];
    if (contextValue !== undefined && contextValue !== '' && contextValue !== null) {
      const filterVal = String(contextValue).toLowerCase();
      // Determine which column index to filter on
      let filterColIndex: number = 0;
      if (filterKey !== undefined) {
        if (typeof filterKey === 'number') {
          filterColIndex = filterKey;
        } else {
          // Find by column name
          const idx = normalizedColumns.findIndex(
            col => col.toLowerCase() === String(filterKey).toLowerCase()
          );
          filterColIndex = idx >= 0 ? idx : 0;
        }
      }
      displayRows = displayRows.filter(row => {
        // Check the specified column first
        const colMatch = String(row[filterColIndex] ?? '').toLowerCase().includes(filterVal);
        // If no match in specified col, also do full-row search for flexibility
        const anyMatch = row.some(cell => String(cell ?? '').toLowerCase().includes(filterVal));
        return colMatch || anyMatch;
      });
    }
  }

  // Filter by search
  if (searchable && searchQuery) {
    displayRows = displayRows.filter((row) =>
      row.some((cell: string | number) => String(cell).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort
  if (sortable && sortColumn !== null) {
    displayRows.sort((a, b) => {
      const aVal = String(a[sortColumn] || '');
      const bVal = String(b[sortColumn] || '');

      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal, undefined, { numeric: true });
      } else {
        return bVal.localeCompare(aVal, undefined, { numeric: true });
      }
    });
  }

  const totalFilteredRows = displayRows.length;
  const isLimited = Boolean(maxRows && displayRows.length >= maxRows && totalFilteredRows >= maxRows);
  const displayedCount = isLimited ? maxRows! : displayRows.length;

  // Apply maxRows cap
  if (maxRows && displayRows.length > maxRows) {
    displayRows = displayRows.slice(0, maxRows);
  }

  return (
    <div className="w-full max-w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-x-auto my-2">
      {title && (
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {title}
          </h3>
        </div>
      )}

      {searchable && (
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <input
            type="text"
            placeholder="Search table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl
                     bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
              {normalizedColumns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className={`px-5 py-3.5 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest
                           border-b border-zinc-200 dark:border-zinc-700 whitespace-nowrap
                           ${sortable ? 'cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {column}
                    {sortable && sortColumn === index && (
                      <span className="text-xs text-indigo-500 font-bold">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  transition-colors duration-150
                  hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10
                  ${rowIndex % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50/60 dark:bg-zinc-800/30'}
                `}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-5 py-3.5 text-sm text-zinc-700 dark:text-zinc-300
                             border-b border-zinc-100 dark:border-zinc-800/60
                             max-w-[240px]"
                    title={typeof cell === 'string' || typeof cell === 'number' ? String(cell) : undefined}
                  >
                    <div className="truncate">
                      {renderCellValue(cell)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {displayRows.length === 0 && (
          <div className="text-center py-12 text-zinc-400 text-sm">
            {filterByContext ? 'No matching records.' : 'No data found'}
          </div>
        )}
      </div>

      {/* Footer: row count indicator */}
      {displayRows.length > 0 && (
        <div className="px-5 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {isLimited
              ? `Showing ${displayedCount} rows (representative sample)`
              : `${displayedCount} ${displayedCount === 1 ? 'row' : 'rows'}`}
          </span>
          {filterByContext && data && data[filterByContext] && (
            <span className="text-xs text-indigo-500 font-medium">
              Filtered by: {String(data[filterByContext])}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;

export const metadata = {
  name: 'data-table',
  category: 'data-display' as const,
  component: DataTable,
  description: 'Advanced data table with sorting, filtering, and search functionality. Supports both simple string columns and complex column objects.',
  tags: ['table', 'data', 'grid', 'sort', 'search', 'filter'],
  propTypes: {
    title: 'string',
    columns: 'string[] | Column[]',
    rows: '(string | number)[][] | Row[]',
    sortable: 'boolean',
    searchable: 'boolean',
  },
};
