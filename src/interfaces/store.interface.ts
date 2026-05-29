// --- UI STATE INTERFACES ---
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
}

// --- NOTIFICATION INTERFACES ---
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// --- REPORTS & ANALYTICS INTERFACES ---
export interface ChecklistItem {
  name: string;
  category: string;
  value: string;
  status: 'Pass' | 'Fail';
}

export interface InspectionReport {
  id: string;
  displayId: string;
  plate: string;
  chassis: string;
  customer: string;
  phone: string;
  centre: string;
  date: string;
  testType: string;
  result: 'Pass' | 'Fail';
  duration: string;
  fee: string;
  checklist: ChecklistItem[];
}

// --- GLOBAL APP STATE STORE INTERFACE ---
export interface AppState {
  // UI Slice
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebarCollapsed: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Notification Slice
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Reports & Analytics Slice
  originalReports: InspectionReport[];
  reports: InspectionReport[];
  searchQuery: string;
  centerFilter: string;
  resultFilter: string;
  dateFilter: string;
  currentPage: number;
  selectedReport: InspectionReport | null;
  isExportingPDF: boolean;
  isExportingCSV: boolean;
  isRefreshing: boolean;
  sortField: 'id' | 'plate' | 'customer' | 'centre' | 'date';
  sortDirection: 'asc' | 'desc';

  // Reports Actions
  setSearchQuery: (query: string) => void;
  setCenterFilter: (center: string) => void;
  setResultFilter: (result: string) => void;
  setDateFilter: (date: string) => void;
  setCurrentPage: (page: number) => void;
  setSelectedReport: (report: InspectionReport | null) => void;
  toggleSort: (field: 'id' | 'plate' | 'customer' | 'centre' | 'date') => void;
  
  // Reports Async Actions
  handleRefresh: () => Promise<void>;
  handleExportPDF: () => Promise<void>;
  handleExportCSV: () => Promise<void>;
  
  // Internal filter applier
  applyFilters: () => void;
}
