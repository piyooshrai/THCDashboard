import api from './api';

export interface Client {
  _id: string;
  userId: string;
  companyName: string;
  industry: string;
  jobTitle: string;
  locationState?: string;
  companyRevenueRange?: string;
  experienceYears?: number;
  calculatedHourlyValue: number;
  hourlyValueOverride?: number;
  baselineAdminHoursPerWeek: number;
  assignedVAs: string[];
  onboardingDate: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface ClientsResponse {
  success: boolean;
  clients: Client[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ClientParams {
  industry?: string;
  status?: 'active' | 'inactive' | 'pending';
  search?: string;
  page?: number;
  limit?: number;
}

export interface ROICalculation {
  hoursReclaimed: number;
  valueOfReclaimedTime: number;
  vaCost: number;
  netSavings: number;
  roiPercentage: number;
  timeframe: 'weekly' | 'monthly' | 'yearly';
}

export interface HourlyValueData {
  jobTitle: string;
  locationState?: string;
  companyRevenueRange?: string;
  experienceYears?: number;
}

export interface HourlyValueResult {
  calculatedHourlyValue: number;
  dataSource: string;
  confidenceLevel: string;
  methodology: string;
}

export const clientService = {
  /**
   * Get all clients with optional filters
   */
  async getAll(params?: ClientParams): Promise<ClientsResponse> {
    const response = await api.get<ClientsResponse>('/clients', { params });
    return response.data;
  },

  /**
   * Get client by ID
   */
  async getById(id: string): Promise<{ success: boolean; client: Client }> {
    const response = await api.get<{ success: boolean; client: Client }>(`/clients/${id}`);
    return response.data;
  },

  /**
   * Create new client
   */
  async create(data: Partial<Client>): Promise<{ success: boolean; client: Client }> {
    const response = await api.post<{ success: boolean; client: Client }>('/clients', data);
    return response.data;
  },

  /**
   * Update client
   */
  async update(id: string, data: Partial<Client>): Promise<{ success: boolean; client: Client }> {
    const response = await api.put<{ success: boolean; client: Client }>(`/clients/${id}`, data);
    return response.data;
  },

  /**
   * Delete client
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/clients/${id}`);
    return response.data;
  },

  /**
   * Get client ROI calculation
   */
  async getROI(
    id: string,
    timeframe: 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<{ success: boolean; roi: ROICalculation }> {
    const response = await api.get<{ success: boolean; roi: ROICalculation }>(`/clients/${id}/roi`, {
      params: { timeframe },
    });
    return response.data;
  },

  /**
   * Recalculate hourly value for client
   */
  async recalculateHourlyValue(id: string): Promise<{ success: boolean; client: Client }> {
    const response = await api.post<{ success: boolean; client: Client }>(
      `/clients/${id}/recalculate-hourly-value`
    );
    return response.data;
  },

  /**
   * Calculate hourly value (without creating client)
   */
  async calculateHourlyValue(data: HourlyValueData): Promise<{ success: boolean; result: HourlyValueResult }> {
    const response = await api.post<{ success: boolean; result: HourlyValueResult }>(
      '/clients/calculate-hourly-value',
      data
    );
    return response.data;
  },
};
