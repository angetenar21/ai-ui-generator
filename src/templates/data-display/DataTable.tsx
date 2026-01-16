import React, { useState } from 'react';

interface DataTableProps {
  title?: string;
  columns: string[];
  rows: (string | number)[][];
  sortable?: boolean;
  searchable?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  rows,
  sortable = false,
  searchable = false,
}) => {
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

  let displayRows = [...rows];

  // Filter by search
  if (searchable && searchQuery) {
    displayRows = displayRows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort
  if (sortable && sortColumn !== null) {
    displayRows.sort((a, b) => {
      const aVal = String(a[sortColumn]);
      const bVal = String(b[sortColumn]);

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
              {columns.map((column, index) => (
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
                    {cell}
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
  description: 'Advanced data table with sorting, filtering, and search functionality',
  tags: ['table', 'data', 'grid', 'sort', 'search', 'filter'],
  propTypes: {
    title: 'string',
    columns: 'string[]',
    rows: '(string | number)[][]',
    sortable: 'boolean',
    searchable: 'boolean',
  },
};
