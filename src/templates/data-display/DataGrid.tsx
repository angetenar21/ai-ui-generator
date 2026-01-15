import React, { useState } from 'react';

interface Column {
  id: string;
  label: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean';
}

interface Row {
  id: string;
  [key: string]: any;
}

interface DataGridProps {
  title?: string;
  columns: Column[];
  rows: Row[];
  selectable?: boolean;
  multiSelect?: boolean;
  editable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: Row) => void;
  onRowEdit?: (row: Row) => void;
  onRowSelect?: (selectedRows: Row[]) => void;
}

const DataGrid: React.FC<DataGridProps> = ({
  title,
  columns,
  rows,
  selectable = false,
  multiSelect = false,
  editable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onRowEdit,
  onRowSelect,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  let filteredRows = rows.filter((row) => {
    return Object.entries(filters).every(([columnId, filterValue]) => {
      if (!filterValue) return true;
      const cellValue = String(row[columnId] || '').toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    });
  });

  // Apply sorting
  if (sortColumn) {
    filteredRows = [...filteredRows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      const column = columns.find((c) => c.id === sortColumn);
      let comparison = 0;

      if (column?.type === 'number') {
        comparison = (Number(aVal) || 0) - (Number(bVal) || 0);
      } else if (column?.type === 'date') {
        comparison =
          new Date(aVal).getTime() - new Date(bVal).getTime();
      } else {
        comparison = String(aVal || '').localeCompare(String(bVal || ''));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = pagination
    ? filteredRows.slice(startIndex, endIndex)
    : filteredRows;

  const handleSort = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleFilter = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    setCurrentPage(1);
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (multiSelect) {
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
        } else {
          newSet.add(rowId);
        }
      } else {
        newSet.clear();
        newSet.add(rowId);
      }

      const selectedRowsData = rows.filter((r) => newSet.has(r.id));
      onRowSelect?.(selectedRowsData);

      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredRows.length) {
      setSelectedRows(new Set());
      if (onRowSelect) {
        onRowSelect([]);
      }
    } else {
      const allIds = new Set(filteredRows.map((r) => r.id));
      setSelectedRows(allIds);
      if (onRowSelect) {
        onRowSelect(filteredRows);
      }
    }
  };

  // Theme values (inline CSS only)
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 6px 18px rgba(16,24,40,0.06)',
    border: '1px solid rgba(16,24,40,0.04)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
  };

  const metaStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#6B7280',
  };

  const theadRowStyle: React.CSSProperties = {
    backgroundColor: '#F3F4F6', // light header band
  };

  const thStyle: React.CSSProperties = {
    padding: '12px 12px',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    borderBottom: '1px solid #E6E9EE',
  };

  const filterRowStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
  };

  const filterInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    fontSize: 12,
    borderRadius: 6,
    border: '1px solid #E6E9EE',
    backgroundColor: '#FFFFFF',
    color: '#111827',
  };

  const rowBaseStyle: React.CSSProperties = {
    transition: 'background-color 0.15s ease',
  };

  const rowAltBg = '#FAFAFA';
  const rowBg = '#FFFFFF';
  const selectedRowBg = '#F9DCDC'; // pale red highlight like sample
  const hoverBg = '#FFF2F2'; // subtle hover

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: 14,
    color: '#111827',
    borderBottom: '1px solid #F1F5F9',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const checkboxStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    accentColor: '#E06A6A', // red accent for checkbox
    cursor: 'pointer',
  };

  const pageMetaStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#6B7280',
  };

  const prevBtnStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: '1px solid #E6E9EE',
    cursor: 'pointer',
  };

  const nextBtnStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 6,
    backgroundColor: '#E06A6A', // red accent
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={cardStyle}>
      {title && (
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <div style={metaStyle}>
            {selectedRows.size > 0 && `${selectedRows.size} selected • `}
            {filteredRows.length} rows
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={theadRowStyle}>
              {selectable && (
                <th style={{ ...thStyle, width: 48 }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredRows.length > 0 &&
                      selectedRows.size === filteredRows.length
                    }
                    onChange={handleSelectAll}
                    style={checkboxStyle}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{
                    ...thStyle,
                    cursor: column.sortable ? 'pointer' : 'default',
                    width: column.width ? column.width : 'auto',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.id && (
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {editable && (
                <th style={{ ...thStyle, width: 90 }}>Actions</th>
              )}
            </tr>

            {columns.some((c) => c.filterable) && (
              <tr style={filterRowStyle}>
                {selectable && <th style={{ padding: 8 }} />}
                {columns.map((column) => (
                  <th key={column.id} style={{ padding: '8px 12px' }}>
                    {column.filterable && (
                      <input
                        type="text"
                        placeholder={`Filter ${column.label}...`}
                        value={filters[column.id] || ''}
                        onChange={(e) => handleFilter(column.id, e.target.value)}
                        style={filterInputStyle}
                      />
                    )}
                  </th>
                ))}
                {editable && <th style={{ padding: 8 }} />}
              </tr>
            )}
          </thead>

          <tbody>
            {paginatedRows.map((row, idx) => {
              const isSelected = selectedRows.has(row.id);
              const bgColor = isSelected
                ? selectedRowBg
                : idx % 2 === 0
                ? rowBg
                : rowAltBg;

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    ...rowBaseStyle,
                    backgroundColor: bgColor,
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        idx % 2 === 0 ? rowBg : rowAltBg;
                  }}
                >
                  {selectable && (
                    <td style={{ ...tdStyle, width: 48 }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={checkboxStyle}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.id}
                      style={{
                        ...tdStyle,
                        maxWidth: column.width ? column.width : 'auto',
                      }}
                    >
                      {column.type === 'boolean'
                        ? row[column.id]
                          ? '✓'
                          : '✗'
                        : row[column.id]}
                    </td>
                  ))}

                  {editable && (
                    <td style={{ ...tdStyle, width: 90 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowEdit?.(row);
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(16,24,40,0.04)',
                          color: '#111827',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredRows.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: '#6B7280' }}>
            No data found
          </div>
        )}
      </div>

      {pagination && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #EEF2F6',
          }}
        >
          <div style={pageMetaStyle}>Page {currentPage} of {totalPages}</div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                ...prevBtnStyle,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                ...nextBtnStyle,
                opacity: currentPage === totalPages ? 0.6 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGrid;

export const metadata = {
  name: 'data-grid',
  category: 'data-display' as const,
  component: DataGrid,
  description: 'Advanced data grid with sorting, filtering, pagination, and selection',
  tags: ['grid', 'table', 'data', 'sort', 'filter', 'pagination', 'editable'],
  propTypes: {
    title: 'string',
    columns: 'Column[]',
    rows: 'Row[]',
    selectable: 'boolean',
    multiSelect: 'boolean',
    editable: 'boolean',
    pagination: 'boolean',
    pageSize: 'number',
    onRowClick: '(row: Row) => void',
    onRowEdit: '(row: Row) => void',
    onRowSelect: '(selectedRows: Row[]) => void',
  },
};
