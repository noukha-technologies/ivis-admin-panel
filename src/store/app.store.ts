import { create } from 'zustand';
import { toast } from 'sonner';
import type { AppState, InspectionReport } from '../interfaces/store.interface';

// --- MOCK DATABASE ENTRIES ---
const MOCK_REPORTS: InspectionReport[] = [
  {
    id: 'JOB-2000',
    displayId: 'JOB-2000',
    plate: 'OM-1004',
    chassis: 'JT2BF22K0W0123456',
    customer: 'Ahmed Al-Said',
    phone: '+986 9123 4567',
    centre: 'Muscat',
    date: '2026-05-28 09:10',
    testType: 'Periodic Renewal',
    result: 'Pass',
    duration: '14 mins',
    fee: 'OMR 25.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '62%', status: 'Pass' },
      { name: 'CO Emission Level', category: 'Environment', value: '0.12%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'No faults', status: 'Pass' }
    ]
  },
  {
    id: 'JOB-2001',
    displayId: 'JOB-2001',
    plate: 'OM-2831',
    chassis: 'SADFC239AJ9283192',
    customer: 'Fatima Al-Balushi',
    phone: '+986 9234 5678',
    centre: 'Seeb',
    date: '2026-05-28 11:30',
    testType: 'Periodic Renewal',
    result: 'Pass',
    duration: '12 mins',
    fee: 'OMR 25.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '58%', status: 'Pass' },
      { name: 'CO Emission Level', category: 'Environment', value: '0.09%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'No faults', status: 'Pass' }
    ]
  },
  {
    id: 'JOB-2002',
    displayId: 'JOB-2002',
    plate: 'OM-7732',
    chassis: 'WBA5A3C56EG489234',
    customer: 'Said Al-Riyami',
    phone: '+986 9456 7890',
    centre: 'Sohar',
    date: '2026-05-27 14:45',
    testType: 'Import Registration',
    result: 'Fail',
    duration: '18 mins',
    fee: 'OMR 35.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '38%', status: 'Fail' },
      { name: 'CO Emission Level', category: 'Environment', value: '4.85%', status: 'Fail' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Worn dampers', status: 'Fail' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Improper angle', status: 'Fail' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Excessive play', status: 'Fail' },
      { name: 'Visual Underbody', category: 'General', value: 'Oil leakage', status: 'Fail' }
    ]
  },
  {
    id: 'JOB-2003',
    displayId: 'JOB-2003',
    plate: 'OM-9021',
    chassis: '1FMCU0G76DK293819',
    customer: 'Salim Al-Harthy',
    phone: '+986 9876 5432',
    centre: 'Muscat',
    date: '2026-05-26 10:20',
    testType: 'Periodic Renewal',
    result: 'Pass',
    duration: '15 mins',
    fee: 'OMR 25.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '65%', status: 'Pass' },
      { name: 'CO Emission Level', category: 'Environment', value: '0.15%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'No faults', status: 'Pass' }
    ]
  },
  {
    id: 'JOB-2004',
    displayId: 'JOB-2004',
    plate: 'OM-1102',
    chassis: 'KMHDU41D7FU103982',
    customer: 'Ali Al-Sadi',
    phone: '+986 9501 0203',
    centre: 'Salalah',
    date: '2026-05-25 15:40',
    testType: 'Safety Inspection',
    result: 'Pass',
    duration: '11 mins',
    fee: 'OMR 20.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '60%', status: 'Pass' },
      { name: 'CO Emission Level', category: 'Environment', value: '0.08%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'No faults', status: 'Pass' }
    ]
  },
  {
    id: 'JOB-2005',
    displayId: 'JOB-2005',
    plate: 'OM-3490',
    chassis: 'SALFV228XAG239103',
    customer: 'Khalfan Al-Nabi',
    phone: '+986 9911 2233',
    centre: 'Seeb',
    date: '2026-05-24 09:55',
    testType: 'Periodic Renewal',
    result: 'Fail',
    duration: '16 mins',
    fee: 'OMR 25.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '45%', status: 'Fail' },
      { name: 'CO Emission Level', category: 'Environment', value: '1.20%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'Exhaust leakage', status: 'Fail' }
    ]
  },
  {
    id: 'JOB-2006',
    displayId: 'JOB-2006',
    plate: 'OM-8821',
    chassis: 'YV1FW2849D1039821',
    customer: 'Mona Al-Masrouri',
    phone: '+986 9321 4321',
    centre: 'Sohar',
    date: '2026-05-22 13:10',
    testType: 'Periodic Renewal',
    result: 'Pass',
    duration: '13 mins',
    fee: 'OMR 25.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '68%', status: 'Pass' },
      { name: 'CO Emission Level', category: 'Environment', value: '0.11%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'No faults', status: 'Pass' }
    ]
  },
  {
    id: 'JOB-2007',
    displayId: 'JOB-2007',
    plate: 'OM-6543',
    chassis: 'JN8AS0MT5BU182931',
    customer: 'Yasmin Al-Zadjali',
    phone: '+986 9612 3412',
    centre: 'Muscat',
    date: '2026-05-20 16:30',
    testType: 'Periodic Renewal',
    result: 'Pass',
    duration: '14 mins',
    fee: 'OMR 25.000',
    checklist: [
      { name: 'Brake Efficiency', category: 'Safety', value: '61%', status: 'Pass' },
      { name: 'CO Emission Level', category: 'Environment', value: '0.10%', status: 'Pass' },
      { name: 'Suspension & Shock', category: 'Mechanical', value: 'Normal', status: 'Pass' },
      { name: 'Headlight Alignment', category: 'Electrical', value: 'Aligned', status: 'Pass' },
      { name: 'Steering Play', category: 'Mechanical', value: 'Acceptable', status: 'Pass' },
      { name: 'Visual Underbody', category: 'General', value: 'No faults', status: 'Pass' }
    ]
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  // 1. UI SLICE INITIAL STATE
  sidebarCollapsed: false,
  theme: 'light',
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (newTheme) => set({ theme: newTheme }),

  // 2. NOTIFICATION SLICE INITIAL STATE
  notifications: [],
  addNotification: (notif) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif = { ...notif, id };
    set((state) => ({ notifications: [...state.notifications, newNotif] }));

    if (notif.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notif.duration || 4000);
    }
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },

  // 3. REPORTS SLICE INITIAL STATE
  originalReports: MOCK_REPORTS,
  reports: MOCK_REPORTS,
  searchQuery: '',
  centerFilter: 'All',
  resultFilter: 'All',
  dateFilter: 'Last 30 Days',
  currentPage: 1,
  selectedReport: null,
  isExportingPDF: false,
  isExportingCSV: false,
  isRefreshing: false,
  sortField: 'date',
  sortDirection: 'desc',

  // Reports Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().applyFilters();
  },

  setCenterFilter: (center) => {
    set({ centerFilter: center, currentPage: 1 });
    get().applyFilters();
  },

  setResultFilter: (result) => {
    set({ resultFilter: result, currentPage: 1 });
    get().applyFilters();
  },

  setDateFilter: (date) => {
    set({ dateFilter: date, currentPage: 1 });
    get().applyFilters();
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setSelectedReport: (report) => {
    set({ selectedReport: report });
  },

  toggleSort: (field) => {
    const { sortField, sortDirection } = get();
    if (sortField === field) {
      set({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortField: field, sortDirection: 'desc' });
    }
    get().applyFilters();
  },

  // Reports Filter Applicator
  applyFilters: () => {
    const {
      originalReports,
      searchQuery,
      centerFilter,
      resultFilter,
      dateFilter,
      sortField,
      sortDirection
    } = get();

    let filtered = [...originalReports];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.plate.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q)
      );
    }

    // Center Filter
    if (centerFilter !== 'All') {
      filtered = filtered.filter((r) => r.centre === centerFilter);
    }

    // Result status Filter
    if (resultFilter !== 'All') {
      filtered = filtered.filter((r) => r.result === resultFilter);
    }

    // Date Range
    if (dateFilter === 'Today') {
      filtered = filtered.filter((r) => r.date.startsWith('2026-05-28') || r.date.startsWith('2026-05-29'));
    } else if (dateFilter === 'Last 7 Days') {
      filtered = filtered.filter((r) => r.date >= '2026-05-22');
    }

    // Apply Sorting
    filtered.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (sortDirection === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });

    set({ reports: filtered });
  },

  // Async Actions with toast feedback
  handleRefresh: async () => {
    set({ isRefreshing: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      isRefreshing: false,
      reports: MOCK_REPORTS,
      searchQuery: '',
      centerFilter: 'All',
      resultFilter: 'All',
      dateFilter: 'Last 30 Days',
      currentPage: 1
    });
    toast.success('Report records successfully synchronized.');
  },

  handleExportPDF: async () => {
    set({ isExportingPDF: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ isExportingPDF: false });
    toast.success('PDF report exported successfully.');
  },

  handleExportCSV: async () => {
    set({ isExportingCSV: true });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    set({ isExportingCSV: false });
    toast.success('CSV dataset exported successfully.');
  }
}));
