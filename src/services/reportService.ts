import api from './api';

export interface Report {
  _id: string;
  title: string;
  type: 'roi' | 'performance' | 'billing' | 'custom';
  clientId?: string;
  vaId?: string;
  generatedBy: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsResponse {
  success: boolean;
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ReportParams {
  type?: 'roi' | 'performance' | 'billing' | 'custom';
  clientId?: string;
  vaId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const reportService = {
  /**
   * Get all reports with optional filters
   */
  async getAll(params?: ReportParams): Promise<ReportsResponse> {
    const response = await api.get<ReportsResponse>('/reports', { params });
    return response.data;
  },

  /**
   * Get report by ID
   */
  async getById(id: string): Promise<{ success: boolean; report: Report }> {
    const response = await api.get<{ success: boolean; report: Report }>(`/reports/${id}`);
    return response.data;
  },

  /**
   * Generate new report
   */
  async create(data: Partial<Report>): Promise<{ success: boolean; report: Report }> {
    const response = await api.post<{ success: boolean; report: Report }>('/reports', data);
    return response.data;
  },

  /**
   * Delete report
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/reports/${id}`);
    return response.data;
  },

  /**
   * Get report download URL
   */
  async getDownloadUrl(id: string): Promise<{ success: boolean; url: string; expiresIn: number }> {
    const response = await api.get<{ success: boolean; url: string; expiresIn: number }>(`/reports/${id}/download`);
    return response.data;
  },

  /**
   * Download report
   */
  async download(id: string): Promise<void> {
    const { url } = await this.getDownloadUrl(id);
    window.open(url, '_blank');
  },
};
