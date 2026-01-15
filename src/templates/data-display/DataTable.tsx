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
    <div className="glass-dark border border-gray-700/50 rounded-2xl p-6 my-4">
      {title && (
        <h3 className="text-xl font-display font-semibold text-white mb-4">
          {title}
        </h3>
      )}

      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600/50 rounded-lg
                     bg-gray-800/50 text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-300
                           border-b border-gray-700
                           ${sortable ? 'cursor-pointer hover:bg-gray-700/50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {column}
                    {sortable && sortColumn === index && (
                      <span className="text-xs text-blue-400">
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
                className="hover:bg-gray-800/30 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-gray-200
                             border-b border-gray-700/50"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {displayRows.length === 0 && (
          <div className="text-center py-8 text-gray-400">
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
