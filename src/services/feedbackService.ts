import api from './api';

export interface Feedback {
  _id: string;
  clientId: string;
  vaId: string;
  rating: number;
  category: 'quality' | 'communication' | 'timeliness' | 'overall';
  comments?: string;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackResponse {
  success: boolean;
  feedback: Feedback[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface FeedbackParams {
  clientId?: string;
  vaId?: string;
  category?: 'quality' | 'communication' | 'timeliness' | 'overall';
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}

export interface VAFeedbackStats {
  vaId: string;
  averageRating: number;
  totalFeedback: number;
  ratingBreakdown: {
    quality: number;
    communication: number;
    timeliness: number;
    overall: number;
  };
}

export const feedbackService = {
  /**
   * Get all feedback with optional filters
   */
  async getAll(params?: FeedbackParams): Promise<FeedbackResponse> {
    const response = await api.get<FeedbackResponse>('/feedback', { params });
    return response.data;
  },

  /**
   * Get feedback by ID
   */
  async getById(id: string): Promise<{ success: boolean; feedback: Feedback }> {
    const response = await api.get<{ success: boolean; feedback: Feedback }>(`/feedback/${id}`);
    return response.data;
  },

  /**
   * Create new feedback
   */
  async create(data: Partial<Feedback>): Promise<{ success: boolean; feedback: Feedback }> {
    const response = await api.post<{ success: boolean; feedback: Feedback }>('/feedback', data);
    return response.data;
  },

  /**
   * Update feedback
   */
  async update(id: string, data: Partial<Feedback>): Promise<{ success: boolean; feedback: Feedback }> {
    const response = await api.put<{ success: boolean; feedback: Feedback }>(`/feedback/${id}`, data);
    return response.data;
  },

  /**
   * Delete feedback
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/feedback/${id}`);
    return response.data;
  },

  /**
   * Get VA feedback statistics
   */
  async getVAStats(vaId: string): Promise<{ success: boolean; stats: VAFeedbackStats }> {
    const response = await api.get<{ success: boolean; stats: VAFeedbackStats }>(`/feedback/va/${vaId}/stats`);
    return response.data;
  },
};
