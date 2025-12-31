import api from './api';

export interface TimeLog {
  _id: string;
  vaId: string;
  clientId: string;
  date: string;
  hoursWorked: number;
  taskDescription: string;
  category?: string;
  billable: boolean;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeLogsResponse {
  success: boolean;
  timeLogs: TimeLog[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface TimeLogParams {
  vaId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  billable?: boolean;
  approved?: boolean;
  page?: number;
  limit?: number;
}

export interface TimeLogSummary {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  approvedHours: number;
  pendingHours: number;
}

export const timeLogService = {
  /**
   * Get all time logs with optional filters
   */
  async getAll(params?: TimeLogParams): Promise<TimeLogsResponse> {
    const response = await api.get<TimeLogsResponse>('/time-logs', { params });
    return response.data;
  },

  /**
   * Get time log by ID
   */
  async getById(id: string): Promise<{ success: boolean; timeLog: TimeLog }> {
    const response = await api.get<{ success: boolean; timeLog: TimeLog }>(`/time-logs/${id}`);
    return response.data;
  },

  /**
   * Create new time log
   */
  async create(data: Partial<TimeLog>): Promise<{ success: boolean; timeLog: TimeLog }> {
    const response = await api.post<{ success: boolean; timeLog: TimeLog }>('/time-logs', data);
    return response.data;
  },

  /**
   * Update time log
   */
  async update(id: string, data: Partial<TimeLog>): Promise<{ success: boolean; timeLog: TimeLog }> {
    const response = await api.put<{ success: boolean; timeLog: TimeLog }>(`/time-logs/${id}`, data);
    return response.data;
  },

  /**
   * Delete time log
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/time-logs/${id}`);
    return response.data;
  },

  /**
   * Get time log summary
   */
  async getSummary(params?: TimeLogParams): Promise<{ success: boolean; summary: TimeLogSummary }> {
    const response = await api.get<{ success: boolean; summary: TimeLogSummary }>('/time-logs/summary', {
      params,
    });
    return response.data;
  },
};
