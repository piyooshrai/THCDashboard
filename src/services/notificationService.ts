import api from './api';

export interface Notification {
  _id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  unreadCount: number;
}

export interface NotificationParams {
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  page?: number;
  limit?: number;
}

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  async getAll(params?: NotificationParams): Promise<NotificationsResponse> {
    const response = await api.get<NotificationsResponse>('/notifications', { params });
    return response.data;
  },

  /**
   * Get notification by ID
   */
  async getById(id: string): Promise<{ success: boolean; notification: Notification }> {
    const response = await api.get<{ success: boolean; notification: Notification }>(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Create new notification
   */
  async create(data: Partial<Notification>): Promise<{ success: boolean; notification: Notification }> {
    const response = await api.post<{ success: boolean; notification: Notification }>('/notifications', data);
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<{ success: boolean; notification: Notification }> {
    const response = await api.patch<{ success: boolean; notification: Notification }>(
      `/notifications/${id}/read`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const response = await api.patch<{ success: boolean; message: string }>('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete notification
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const response = await api.delete<{ success: boolean; message: string; deletedCount: number }>(
      '/notifications/read-all'
    );
    return response.data;
  },
};
