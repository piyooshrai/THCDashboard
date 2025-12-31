import api from './api';

export interface Document {
  _id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  clientId?: string;
  vaId?: string;
  category: 'contract' | 'invoice' | 'report' | 'other';
  s3Key: string;
  s3Url: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  success: boolean;
  documents: Document[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface DocumentParams {
  clientId?: string;
  vaId?: string;
  category?: 'contract' | 'invoice' | 'report' | 'other';
  page?: number;
  limit?: number;
}

export const documentService = {
  /**
   * Get all documents with optional filters
   */
  async getAll(params?: DocumentParams): Promise<DocumentsResponse> {
    const response = await api.get<DocumentsResponse>('/documents', { params });
    return response.data;
  },

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<{ success: boolean; document: Document }> {
    const response = await api.get<{ success: boolean; document: Document }>(`/documents/${id}`);
    return response.data;
  },

  /**
   * Upload new document
   */
  async upload(file: File, metadata: Partial<Document>): Promise<{ success: boolean; document: Document }> {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post<{ success: boolean; document: Document }>('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete document
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/documents/${id}`);
    return response.data;
  },

  /**
   * Get document download URL
   */
  async getDownloadUrl(id: string): Promise<{ success: boolean; url: string; expiresIn: number }> {
    const response = await api.get<{ success: boolean; url: string; expiresIn: number }>(
      `/documents/${id}/download`
    );
    return response.data;
  },

  /**
   * Download document
   */
  async download(id: string): Promise<void> {
    const { url } = await this.getDownloadUrl(id);
    window.open(url, '_blank');
  },
};
