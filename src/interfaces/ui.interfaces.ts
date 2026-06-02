import type { ReactNode } from 'react';
import * as React from 'react';
import type { DayPicker } from 'react-day-picker';

// ==========================================
// Calendar Component Interfaces
// ==========================================
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  bookedDates?: Date[];
};

// ==========================================
// DropdownMenu Component Interfaces
// ==========================================
export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  selected?: boolean;
}

export interface DropdownMenuSection {
  label?: string;
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  sections: DropdownMenuSection[];
  align?: 'left' | 'right';
  className?: string;
}

// ==========================================
// DataTable Component Interfaces
// ==========================================
export interface ColumnDef<TData> {
  id?: string;
  header: string | React.ReactNode;
  accessorKey?: keyof TData | string;
  cell?: (info: { row: TData; value: any }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchPlaceholder?: string;
  animatedSearchHints?: string[];
  searchKey?: keyof TData | string;
  filterColumnKey?: keyof TData | string;
  filterPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  defaultPageSize?: number;
  filterElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  showControls?: boolean;
  showPagination?: boolean;
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  headerWeightClassName?: string;
  cellWeightClassName?: string;
  serverSidePagination?: boolean;
  totalRows?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  filterPosition?: 'left' | 'right';
}

// ==========================================
// FilterDropdown Component Interfaces
// ==========================================
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  icon?: React.ReactNode;
  type: 'select' | 'boolean' | 'text';
  options?: FilterOption[];
  // Selected value(s) - string, array of strings, or boolean
  value?: any;
  selectType?: 'single' | 'multiple';
}

export interface FilterDropdownProps {
  fields: FilterField[];
  onChange: (selectedFilters: Record<string, any>) => void;
  align?: 'left' | 'right';
  className?: string;
}

export type SideDrawerSize = 'sm' | 'md' | 'lg';

export interface SideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** sm ≈ 480px, md ≈ 640px, lg ≈ 920px (default lg) */
  size?: SideDrawerSize;
  className?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
}