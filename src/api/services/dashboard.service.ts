import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import type { DashboardStats, RevenueData } from '../../interfaces/dashboard.interface';

export type { DashboardStats, RevenueData };

export const dashboardService = {
  getStats: () =>
    axiosInstance.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS),

  getRevenue: (params?: { year?: number }) =>
    axiosInstance.get<RevenueData[]>(ENDPOINTS.DASHBOARD.REVENUE, { params }),
};
