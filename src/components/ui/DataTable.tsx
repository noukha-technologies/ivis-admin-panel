import { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { DropdownMenu } from './DropdownMenu';
import type { ColumnDef, DataTableProps, DropdownMenuSection } from '../../interfaces/ui.interfaces';

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKey,
  filterColumnKey,
  filterPlaceholder = "Filter",
  filterOptions,
  defaultPageSize = 10,
  filterElement,
  leftElement,
}: DataTableProps<TData>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // State for Column Visibility Controller
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close visibility dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target as Node)) {
        setShowColumnDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter columns list based on hiding option
  const hidableColumns = useMemo(() => {
    return columns.filter(col => col.enableHiding !== false && (col.accessorKey || col.id));
  }, [columns]);

  // Determine actual unique string ID for a column
  const getColumnId = (col: ColumnDef<TData>): string => {
    return (col.id || String(col.accessorKey || ''));
  };

  const getColumnLabel = (col: ColumnDef<TData>): string => {
    if (typeof col.header === 'string') return col.header;
    return String(col.id || col.accessorKey || 'Column');
  };

  // Toggle column visibility
  const toggleColumnVisibility = (colId: string) => {
    setHiddenColumns(prev =>
      prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]
    );
  };

  // Compute final visible columns to render
  const visibleColumns = useMemo(() => {
    return columns.filter(col => !hiddenColumns.includes(getColumnId(col)));
  }, [columns, hiddenColumns]);

  // Handle column header clicks for sorting
  const handleSort = (colKey: string) => {
    setSortConfig(prev => {
      if (prev && prev.key === colKey) {
        if (prev.direction === 'asc') {
          return { key: colKey, direction: 'desc' };
        }
        return null;
      }
      return { key: colKey, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  // 1. Apply Search and Filters locally
  const processedData = useMemo(() => {
    let result = [...data];

    // Status / Category Filters
    if (filterColumnKey && filterValue !== 'All') {
      result = result.filter(item => {
        const val = String((item as any)[filterColumnKey] || '');
        return val.toLowerCase() === filterValue.toLowerCase();
      });
    }

    // Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        if (searchKey) {
          const val = String((item as any)[searchKey] || '');
          return val.toLowerCase().includes(q);
        }
        // General search across all string values
        return Object.values(item as any).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const valA = String((a as any)[key] || '').toLowerCase();
        const valB = String((b as any)[key] || '').toLowerCase();

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, filterColumnKey, filterValue, searchKey, sortConfig]);

  // Pagination bounds
  const totalPages = Math.ceil(processedData.length / defaultPageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * defaultPageSize;
    return processedData.slice(start, start + defaultPageSize);
  }, [processedData, currentPage, defaultPageSize]);

  // Handle active page switching
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate sliding window centered page numbers matching the mockup:
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Top Filter and Controller Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 w-full">
        {/* Left side content (e.g. switcher) or spacer */}
        <div>{leftElement}</div>

        {/* Right side controls: Search & Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full max-w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-[13.5px] bg-white border border-neutral-200 rounded-xl placeholder-[#667085] text-[#1f2937] focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
            />
          </div>
          {filterElement}

          {!filterElement && filterColumnKey && filterOptions && (() => {
            const activeFilterLabel = filterValue === 'All' ? filterPlaceholder : (filterOptions.find(opt => opt.value === filterValue)?.label || filterValue);
            const filterDropdownSections: DropdownMenuSection[] = [
              {
                items: [
                  {
                    id: 'all',
                    label: filterPlaceholder,
                    selected: filterValue === 'All',
                    onClick: () => {
                      setFilterValue('All');
                      setCurrentPage(1);
                    }
                  },
                  ...filterOptions.map(opt => ({
                    id: opt.value,
                    label: opt.label,
                    selected: filterValue === opt.value,
                    onClick: () => {
                      setFilterValue(opt.value);
                      setCurrentPage(1);
                    }
                  }))
                ]
              }
            ];

            return (
              <DropdownMenu
                trigger={
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 text-[#344054] hover:bg-neutral-50 shadow-sm rounded-xl text-[13.5px] font-semibold transition-all cursor-pointer">
                    <span>{activeFilterLabel}</span>
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
                sections={filterDropdownSections}
                align="right"
              />
            );
          })()}

          {/* Column Controller Trigger Dropdown */}
          {hidableColumns.length > 0 && (
            <div className="relative" ref={columnDropdownRef}>
              <button
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 text-[#344054] hover:bg-neutral-50 shadow-sm rounded-xl text-[13.5px] font-semibold transition-all cursor-pointer"
              >
                <span>Columns</span>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showColumnDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg py-2.5 z-40 text-left animate-fadeInMenu max-h-60 overflow-y-auto">
                  <p className="px-3.5 pb-1.5 text-[12px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 mb-1.5">Toggle Columns</p>
                  {hidableColumns.map(col => {
                    const colId = getColumnId(col);
                    const isVisible = !hiddenColumns.includes(colId);
                    return (
                      <label
                        key={colId}
                        className="flex items-center gap-2.5 px-4 py-1.5 text-[13.5px] font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => toggleColumnVisibility(colId)}
                          className="w-4 h-4 rounded border-gray-300 text-neutral-800 focus:ring-neutral-800 cursor-pointer"
                        />
                        <span>{getColumnLabel(col)}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table Bordered Card */}
      <div className="w-full bg-white border border-neutral-200/90 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-[#FCFCFD]">
                {visibleColumns.map((col, idx) => {
                  const colId = getColumnId(col);
                  const isSortable = col.enableSorting !== false && col.accessorKey;
                  const currentSort = sortConfig && sortConfig.key === col.accessorKey;

                  return (
                    <th
                      key={colId || idx}
                      onClick={() => isSortable && typeof col.accessorKey === 'string' && handleSort(col.accessorKey)}
                      className={cn(
                        "px-6 py-3.5 text-[12.5px] text-[#667085] font-semibold select-none",
                        isSortable ? "cursor-pointer hover:text-neutral-900 transition-colors" : ""
                      )}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                        {isSortable && (
                          <svg
                            className={cn(
                              "w-3.5 h-3.5 text-gray-400 transition-transform",
                              currentSort && sortConfig?.direction === 'desc' ? "rotate-180 text-neutral-800" : "",
                              currentSort && sortConfig?.direction === 'asc' ? "text-neutral-800" : ""
                            )}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-neutral-50 hover:bg-neutral-50/50 bg-white transition-colors duration-150"
                  >
                    {visibleColumns.map((col, colIdx) => {
                      const colId = getColumnId(col);
                      const rawValue = col.accessorKey ? (row as any)[col.accessorKey] : undefined;

                      return (
                        <td key={colId || colIdx} className="px-6 py-4 text-[14px]">
                          {col.cell ? col.cell({ row, value: rawValue }) : String(rawValue ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-6 py-12 text-center text-[14px] text-slate-500 font-medium">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Centered Pagination Footer (Mockup layout) */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-1.5 px-6 py-4.5 border-t border-neutral-100 bg-white select-none">
            {/* Previous link button with chevron */}
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1.5 text-[13.5px] font-semibold text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50/50 rounded-lg flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>Previous</span>
            </button>

            {/* Centered Page Numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, idx) => {
                if (typeof page === 'string') {
                  return (
                    <span key={idx} className="px-2 py-1.5 text-[13.5px] text-neutral-400 font-semibold select-none">
                      {page}
                    </span>
                  );
                }
                const isActive = page === currentPage;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "px-3 py-1.5 text-[13.5px] cursor-pointer transition-all min-w-8 text-center",
                      isActive
                        ? "border border-neutral-200 bg-white rounded-lg text-neutral-800 shadow-sm font-bold"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-lg font-semibold"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next link button with chevron */}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1.5 text-[13.5px] font-semibold text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50/50 rounded-lg flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
