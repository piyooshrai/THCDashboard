import api from './api';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'client' | 'va';
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface UserParams {
  role?: 'admin' | 'client' | 'va';
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}

export const userService = {
  /**
   * Get all users with optional filters
   */
  async getAll(params?: UserParams): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<{ success: boolean; user: User }> {
    const response = await api.get<{ success: boolean; user: User }>(`/users/${id}`);
    return response.data;
  },

  /**
   * Update user
   */
  async update(id: string, data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const response = await api.put<{ success: boolean; user: User }>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return response.data;
  },

  /**
   * Toggle user active status
   */
  async toggleStatus(id: string): Promise<{ success: boolean; user: User }> {
    const response = await api.patch<{ success: boolean; user: User }>(`/users/${id}/toggle-status`);
    return response.data;
  },
};
