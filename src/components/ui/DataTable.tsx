import { useState, useMemo, useRef, useEffect } from 'react';
import SwirlingEffectSpinner from './SwirlingEffectSpinner';
import { cn } from '../../utils/cn';
import { DropdownMenu } from './DropdownMenu';
import noDataImg from '../../assets/images/no_data_premium.png';
import type { ColumnDef, DataTableProps, DropdownMenuSection } from '../../interfaces/ui.interfaces';
import { useAnimatedPlaceholder } from '../../hooks/useAnimatedPlaceholder';


export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  animatedSearchHints,
  searchKey,
  searchKeys,
  filterColumnKey,
  filterPlaceholder = "Filter",
  filterOptions,
  defaultPageSize = 10,
  filterElement,
  leftElement,
  rightElement,
  showControls = true,
  showPagination = true,
  loading = false,
  onRowClick,
  headerWeightClassName = "font-semibold",
  cellWeightClassName = "font-medium",
  serverSidePagination = false,
  totalRows: totalRowsProp,
  totalPages: totalPagesProp,
  currentPage: currentPageProp,
  onPageChange,
  filterPosition = 'right',
}: DataTableProps<TData>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
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
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some(key => {
            const val = String((item as any)[key] || '');
            return val.toLowerCase().includes(q);
          });
        }
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
  }, [data, searchQuery, filterColumnKey, filterValue, searchKey, searchKeys, sortConfig]);

  // Pagination bounds and server side helper variables
  const isServerSide = serverSidePagination === true;
  const displayCurrentPage = isServerSide ? (currentPageProp ?? 1) : currentPage;
  const displayTotalPages = isServerSide ? (totalPagesProp ?? 1) : (Math.ceil(processedData.length / pageSize) || 1);
  const displayTotalRows = isServerSide ? (totalRowsProp ?? data.length) : processedData.length;

  const paginatedData = useMemo(() => {
    if (isServerSide) {
      return processedData;
    }
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize, isServerSide]);

  // Handle active page switching
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= displayTotalPages) {
      if (isServerSide) {
        onPageChange?.(page);
      } else {
        setCurrentPage(page);
      }
    }
  };

  // Reusable filter dropdown component renderer
  const renderFilterDropdown = () => {
    if (filterElement) return filterElement;
    if (!filterColumnKey || !filterOptions) return null;

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
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 text-[#344054] hover:bg-neutral-50 shadow-sm rounded-xl text-[13.5px] font-semibold transition-all cursor-pointer whitespace-nowrap">
            <span>{activeFilterLabel}</span>
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        }
        sections={filterDropdownSections}
        align={filterPosition === 'left' ? 'left' : 'right'}
      />
    );
  };



  return (
    <div className="w-full flex flex-col gap-4">

      {/* Top Filter and Controller Row */}
      {showControls && (
        <div className="flex items-center justify-between flex-wrap gap-3 w-full">
          {/* Left side content (e.g. switcher) or spacer */}
          <div className="flex items-center gap-2">
            {leftElement}
            {filterPosition === 'left' && renderFilterDropdown()}
          </div>

          {/* Right side controls: Search & Dropdowns */}
          <div className="flex items-center gap-2">
            {/* 1. Search Input */}
            <div className="relative w-full max-w-72">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={useAnimatedPlaceholder(searchPlaceholder, animatedSearchHints)}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-[13.5px] bg-white border border-neutral-200 rounded-xl placeholder-[#667085] text-[#1f2937] focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
              />
            </div>

            {/* 2. Filter Dropdowns if right-positioned */}
            {filterPosition === 'right' && (filterElement || renderFilterDropdown())}

            {/* 3. Column Controller Trigger Dropdown */}
            {hidableColumns.length > 0 && (
              <div className="relative" ref={columnDropdownRef}>
                <button
                  onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                  className="inline-flex items-center justify-center px-3 py-2 bg-white border border-neutral-200 text-[#344054] hover:bg-neutral-50 shadow-sm rounded-xl transition-all cursor-pointer"
                  title="Columns"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-slate-700">
                    <path d="M2 5h20" /><path d="M6 12h12" /><path d="M9 19h6" />
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

            {/* 4. Right Element */}
            {rightElement}
          </div>
        </div>
      )}

      {/* Main Table Bordered Card */}
      <div className="w-full bg-white border border-neutral-200/90 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-[#FCFCFD]">
                {visibleColumns.map((col, idx) => {
                  const colId = getColumnId(col);
                  const isSortable = col.enableSorting !== false && col.accessorKey;

                  return (
                    <th
                      key={colId || idx}
                      onClick={() => isSortable && typeof col.accessorKey === 'string' && handleSort(col.accessorKey)}
                      className={cn(
                        "px-6 py-3.5 text-[12.5px] text-[#667085] select-none",
                        headerWeightClassName,
                        isSortable ? "cursor-pointer hover:text-neutral-900 transition-colors" : ""
                      )}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-6 py-16 text-center bg-white">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <SwirlingEffectSpinner />
                      <p className="text-[13px] text-[#667085] font-medium">Loading data…</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={cn(
                      "border-b border-neutral-50 hover:bg-neutral-50/50 bg-white transition-colors duration-150",
                      onRowClick ? "cursor-pointer" : ""
                    )}
                  >
                    {visibleColumns.map((col, colIdx) => {
                      const colId = getColumnId(col);
                      const rawValue = col.accessorKey ? (row as any)[col.accessorKey] : undefined;

                      return (
                        <td key={colId || colIdx} className={cn("px-6 py-4 text-[14px]", cellWeightClassName)}>
                          {col.cell ? col.cell({ row, value: rawValue }) : String(rawValue ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-6 py-16 text-center select-none bg-white">
                    <div className="flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
                      <img
                        src={noDataImg}
                        alt="No records found"
                        className="w-36 h-36 object-contain opacity-95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                      />
                      <div>
                        <h4 className="text-[15.5px] font-bold text-[#101828] mb-0.5">No results found</h4>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Premium Pagination Footer (Matching User Mockup) */}
        {showPagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-[#FCFCFD] text-[13.5px] text-[#475467] select-none font-medium">
            {/* Left side: Showing X of Y row(s) */}
            <div>
              Showing <span className="font-semibold text-[#101828]">{paginatedData.length}</span> of <span className="font-semibold text-[#101828]">{displayTotalRows}</span> row(s).
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-6">
              {/* Rows per page selector */}
              {!isServerSide && (
                <div className="flex items-center gap-2">
                  <span className="text-[#344054]">Rows per page</span>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-[#d0d5dd] rounded-lg px-3 py-1.5 pr-8 text-[13px] font-semibold text-[#344054] focus:outline-none focus:border-neutral-400 cursor-pointer shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
                    >
                      {[5, 10, 15, 20, 30, 50, 100].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {/* Page indicator */}
              <div>
                Page <span className="font-semibold text-[#101828]">{displayCurrentPage}</span> of <span className="font-semibold text-[#101828]">{displayTotalPages}</span>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1.5">
                {/* First page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={displayCurrentPage === 1}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#d0d5dd] text-[#344054] bg-white hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[15px] font-bold"
                  title="First Page"
                >
                  «
                </button>
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(displayCurrentPage - 1)}
                  disabled={displayCurrentPage === 1}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#d0d5dd] text-[#344054] bg-white hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[15px] font-bold"
                  title="Previous Page"
                >
                  ‹
                </button>
                {/* Next */}
                <button
                  onClick={() => handlePageChange(displayCurrentPage + 1)}
                  disabled={displayCurrentPage === displayTotalPages}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#d0d5dd] text-[#344054] bg-white hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[15px] font-bold"
                  title="Next Page"
                >
                  ›
                </button>
                {/* Last page */}
                <button
                  onClick={() => handlePageChange(displayTotalPages)}
                  disabled={displayCurrentPage === displayTotalPages}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#d0d5dd] text-[#344054] bg-white hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[15px] font-bold"
                  title="Last Page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
