import api from './api';

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  vaId: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoicesResponse {
  success: boolean;
  invoices: Invoice[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface InvoiceParams {
  clientId?: string;
  vaId?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  page?: number;
  limit?: number;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalRevenue: number;
}

export const invoiceService = {
  /**
   * Get all invoices with optional filters
   */
  async getAll(params?: InvoiceParams): Promise<InvoicesResponse> {
    const response = await api.get<InvoicesResponse>('/invoices', { params });
    return response.data;
  },

  /**
   * Get invoice by ID
   */
  async getById(id: string): Promise<{ success: boolean; invoice: Invoice }> {
    const response = await api.get<{ success: boolean; invoice: Invoice }>(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Create new invoice
   */
  async create(data: Partial<Invoice>): Promise<{ success: boolean; invoice: Invoice }> {
    const response = await api.post<{ success: boolean; invoice: Invoice }>('/invoices', data);
    return response.data;
  },

  /**
   * Update invoice
   */
  async update(id: string, data: Partial<Invoice>): Promise<{ success: boolean; invoice: Invoice }> {
    const response = await api.put<{ success: boolean; invoice: Invoice }>(`/invoices/${id}`, data);
    return response.data;
  },

  /**
   * Delete invoice
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/invoices/${id}`);
    return response.data;
  },

  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: string): Promise<{ success: boolean; invoice: Invoice }> {
    const response = await api.post<{ success: boolean; invoice: Invoice }>(`/invoices/${id}/pay`);
    return response.data;
  },

  /**
   * Get invoice statistics
   */
  async getStats(): Promise<{ success: boolean; stats: InvoiceStats }> {
    const response = await api.get<{ success: boolean; stats: InvoiceStats }>('/invoices/stats');
    return response.data;
  },
};
