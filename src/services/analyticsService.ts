import api from './api';

export interface DashboardStats {
  totalClients: number;
  activeVAs: number;
  totalRevenue: number;
  avgClientROI: number;
  totalHoursLogged: number;
  pendingInvoices: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface RevenueData {
  month: string;
  revenue: number;
  invoiceCount: number;
}

export interface TopVA {
  vaId: string;
  name: string;
  totalHours: number;
  revenue: number;
  clientCount: number;
  avgRating: number;
}

export interface ClientAnalytics {
  clientId: string;
  companyName: string;
  totalHoursWorked: number;
  totalCost: number;
  roi: {
    percentage: number;
    netSavings: number;
  };
  assignedVAs: number;
  invoiceCount: number;
}

export interface VAAnalytics {
  vaId: string;
  name: string;
  totalHoursWorked: number;
  totalRevenue: number;
  clientCount: number;
  avgClientSatisfaction: number;
  taskCompletionRate: number;
}

export const analyticsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboard(): Promise<{ success: boolean; stats: DashboardStats }> {
    const response = await api.get<{ success: boolean; stats: DashboardStats }>('/analytics/dashboard');
    return response.data;
  },

  /**
   * Get revenue by month
   */
  async getRevenueByMonth(months: number = 12): Promise<{ success: boolean; data: RevenueData[] }> {
    const response = await api.get<{ success: boolean; data: RevenueData[] }>('/analytics/revenue-by-month', {
      params: { months },
    });
    return response.data;
  },

  /**
   * Get top performing VAs
   */
  async getTopVAs(limit: number = 10): Promise<{ success: boolean; data: TopVA[] }> {
    const response = await api.get<{ success: boolean; data: TopVA[] }>('/analytics/top-vas', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get client analytics
   */
  async getClientAnalytics(clientId: string): Promise<{ success: boolean; analytics: ClientAnalytics }> {
    const response = await api.get<{ success: boolean; analytics: ClientAnalytics }>(
      `/analytics/client/${clientId}`
    );
    return response.data;
  },

  /**
   * Get VA analytics
   */
  async getVAAnalytics(vaId: string): Promise<{ success: boolean; analytics: VAAnalytics }> {
    const response = await api.get<{ success: boolean; analytics: VAAnalytics }>(`/analytics/va/${vaId}`);
    return response.data;
  },
};
