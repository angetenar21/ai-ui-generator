import React, { useState } from 'react';

interface PaginationProps {
  totalPages?: number;
  pageCount?: number;
  currentPage?: number;
  defaultPage?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  siblingCount?: number;
  variant?: 'default' | 'outlined' | 'rounded';
  onChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  pageCount,
  currentPage,
  defaultPage = 1,
  showFirstLast = true,
  showPrevNext = true,
  siblingCount = 1,
  variant = 'default',
  onChange,
}) => {
  const total = totalPages || pageCount || 1;
  const [activePage, setActivePage] = useState(currentPage || defaultPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= total) {
      setActivePage(page);
      onChange?.(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const leftSibling = Math.max(activePage - siblingCount, 1);
    const rightSibling = Math.min(activePage + siblingCount, total);

    // Always show first page
    pages.push(1);

    // Show dots if there's a gap
    if (leftSibling > 2) {
      pages.push('...');
    }

    // Show page numbers around active page
    for (let i = Math.max(2, leftSibling); i <= Math.min(total - 1, rightSibling); i++) {
      pages.push(i);
    }

    // Show dots if there's a gap
    if (rightSibling < total - 1) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  };

  const variantClasses = {
    default: {
      button: 'px-3 py-2 border border-gray-700',
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'bg-gray-800 text-gray-300 hover:bg-gray-700',
    },
    outlined: {
      button: 'px-3 py-2 border-2',
      active: 'border-blue-500 text-blue-400 bg-blue-500/10',
      inactive: 'border-gray-700 text-gray-300 hover:border-gray-600',
    },
    rounded: {
      button: 'px-3 py-2 rounded-full border border-gray-700',
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'bg-gray-800 text-gray-300 hover:bg-gray-700',
    },
  };

  const classes = variantClasses[variant];
  const pages = getPageNumbers();

  return (
    <div className="card rounded-card p-4 my-4">
      <div className="flex items-center justify-center gap-1">
        {showFirstLast && (
          <button
            className={`${classes.button} ${classes.inactive}`}
            onClick={() => handlePageChange(1)}
            disabled={activePage === 1}
          >
            ««
          </button>
        )}

        {showPrevNext && (
          <button
            className={`${classes.button} ${classes.inactive}`}
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          >
            ‹
          </button>
        )}

        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === activePage;

          return (
            <button
              key={pageNumber}
              className={`${classes.button} ${isActive ? classes.active : classes.inactive}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        {showPrevNext && (
          <button
            className={`${classes.button} ${classes.inactive}`}
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === total}
          >
            ›
          </button>
        )}

        {showFirstLast && (
          <button
            className={`${classes.button} ${classes.inactive}`}
            onClick={() => handlePageChange(total)}
            disabled={activePage === total}
          >
            »»
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;

export const metadata = {
  name: 'pagination',
  category: 'navigation' as const,
  component: Pagination,
  description: 'Page pagination component with customizable controls and variants',
  tags: ['ui', 'navigation', 'interactive'],
};
