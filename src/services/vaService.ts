import api from './api';

export interface VA {
  _id: string;
  userId: string;
  specialization: string[];
  hourlyRate: number;
  assignedClients: string[];
  skillsAssessment?: {
    technicalSkills: number;
    communication: number;
    reliability: number;
    taskCompletion: number;
  };
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface VAsResponse {
  success: boolean;
  vas: VA[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface VAParams {
  specialization?: string;
  status?: 'active' | 'inactive' | 'on-leave';
  search?: string;
  page?: number;
  limit?: number;
}

export interface VAPerformance {
  totalHoursWorked: number;
  averageRating: number;
  tasksCompleted: number;
  clientSatisfaction: number;
  revenueGenerated: number;
}

export const vaService = {
  /**
   * Get all VAs with optional filters
   */
  async getAll(params?: VAParams): Promise<VAsResponse> {
    const response = await api.get<VAsResponse>('/vas', { params });
    return response.data;
  },

  /**
   * Get VA by ID
   */
  async getById(id: string): Promise<{ success: boolean; va: VA }> {
    const response = await api.get<{ success: boolean; va: VA }>(`/vas/${id}`);
    return response.data;
  },

  /**
   * Create new VA
   */
  async create(data: Partial<VA>): Promise<{ success: boolean; va: VA }> {
    const response = await api.post<{ success: boolean; va: VA }>('/vas', data);
    return response.data;
  },

  /**
   * Update VA
   */
  async update(id: string, data: Partial<VA>): Promise<{ success: boolean; va: VA }> {
    const response = await api.put<{ success: boolean; va: VA }>(`/vas/${id}`, data);
    return response.data;
  },

  /**
   * Delete VA
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/vas/${id}`);
    return response.data;
  },

  /**
   * Get VA performance metrics
   */
  async getPerformance(id: string): Promise<{ success: boolean; performance: VAPerformance }> {
    const response = await api.get<{ success: boolean; performance: VAPerformance }>(`/vas/${id}/performance`);
    return response.data;
  },
};
