import React, { useState, useMemo } from 'react';

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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns = [],
  rows = [],
  sortable = false,
  searchable = false,
}) => {
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

  return (
    <div className="w-full max-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 my-2 overflow-hidden">
      {title && (
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 truncate">
          {title}
        </h3>
      )}

      {searchable && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
          />
        </div>
      )}

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full border-collapse min-w-0">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              {normalizedColumns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className={`px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300
                           border-b border-gray-200 dark:border-gray-700 whitespace-nowrap
                           ${sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {column}
                    {sortable && sortColumn === index && (
                      <span className="text-xs text-orange-500">
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
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300
                             border-b border-gray-100 dark:border-gray-700/50 whitespace-nowrap"
                  >
                    {renderCellValue(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {displayRows.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No data found
          </div>
        )}
      </div>
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
