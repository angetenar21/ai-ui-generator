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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
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
      button: 'min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ease-out',
      active: 'bg-orange-500 text-white shadow-md shadow-orange-500/25',
      inactive: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/50',
    },
    outlined: {
      button: 'min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ease-out border-2',
      active: 'border-orange-500 text-white bg-orange-500 shadow-md shadow-orange-500/25',
      inactive: 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-orange-300',
    },
    rounded: {
      button: 'min-w-[40px] h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ease-out',
      active: 'bg-orange-500 text-white shadow-md shadow-orange-500/25',
      inactive: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/50',
    },
  };

  const classes = variantClasses[variant];
  const pages = getPageNumbers();

  return (
    <div className="card rounded-2xl p-4 my-4">
      <div className="flex items-center justify-center gap-1.5">
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
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-zinc-400 dark:text-zinc-500">
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
