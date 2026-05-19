import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  growth: number;
}

export interface RevenueData {
  month: string;
  amount: number;
}

export const dashboardService = {
  getStats: () =>
    axiosInstance.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS),

  getRevenue: (params?: { year?: number }) =>
    axiosInstance.get<RevenueData[]>(ENDPOINTS.DASHBOARD.REVENUE, { params }),
};
