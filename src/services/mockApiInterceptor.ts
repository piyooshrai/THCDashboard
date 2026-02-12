import type { AxiosInstance } from 'axios';

// Mock data generator
const generateMockClients = () => [
  {
    id: 'client-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    company: 'Tech Corp',
    role: 'client',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@startup.io',
    company: 'StartupIO',
    role: 'client',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const generateMockVAs = () => [
  {
    id: 'va-1',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria@va.com',
    role: 'va',
    hourlyRate: 25,
    skills: ['Admin Support', 'Email Management'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'va-2',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos@va.com',
    role: 'va',
    hourlyRate: 30,
    skills: ['Social Media', 'Content Writing'],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const generateMockTimeLogs = () => [
  {
    id: 'log-1',
    vaId: 'va-1',
    clientId: 'client-1',
    date: new Date().toISOString(),
    hours: 8,
    description: 'Email management and calendar organization',
    status: 'approved',
  },
  {
    id: 'log-2',
    vaId: 'va-2',
    clientId: 'client-2',
    date: new Date().toISOString(),
    hours: 6,
    description: 'Social media content creation',
    status: 'pending',
  },
];

const generateMockInvoices = () => [
  {
    _id: 'inv-1',
    invoiceNumber: 'INV-001',
    clientId: 'client-1',
    vaId: 'va-1',
    amount: 2000,
    currency: 'USD',
    status: 'paid',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    issueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lineItems: [{
      description: 'VA Services',
      quantity: 1,
      rate: 2000,
      amount: 2000
    }]
  },
  {
    _id: 'inv-2',
    invoiceNumber: 'INV-002',
    clientId: 'client-2',
    vaId: 'va-2',
    amount: 1500,
    currency: 'USD',
    status: 'pending',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    issueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lineItems: [{
      description: 'VA Services',
      quantity: 1,
      rate: 1500,
      amount: 1500
    }]
  },
  {
    _id: 'inv-3',
    invoiceNumber: 'INV-003',
    clientId: 'client-1',
    vaId: 'va-1',
    amount: 3000,
    currency: 'USD',
    status: 'overdue',
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lineItems: [{
      description: 'VA Services',
      quantity: 1,
      rate: 3000,
      amount: 3000
    }]
  },
];

const generateMockReports = () => [
  {
    _id: 'report-1',
    reportType: 'weekly',
    clientId: 'client-1',
    vaId: 'va-1',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
    status: 'generated',
    s3Key: 'reports/weekly-report-1.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'report-2',
    reportType: 'monthly',
    clientId: 'client-2',
    vaId: 'va-2',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
    status: 'generated',
    s3Key: 'reports/monthly-report-2.pdf',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'report-3',
    reportType: 'custom',
    clientId: 'client-1',
    vaId: 'va-1',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'generated',
    s3Key: 'reports/custom-report-3.pdf',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const generateMockAnalytics = () => ({
  totalClients: 2,
  totalVAs: 2,
  totalRevenue: 3500,
  totalHours: 14,
  monthlyRevenue: [
    { month: 'Jan', revenue: 5000 },
    { month: 'Feb', revenue: 6000 },
    { month: 'Mar', revenue: 7000 },
  ],
});

// Mock API response handler
export const setupMockApiInterceptor = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.request.use(
    async (config) => {
      const url = config.url || '';
      const method = config.method?.toUpperCase();

      console.log(`[Mock API] ${method} ${url}`);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Match URL patterns and return mock data
      let mockResponse: any = null;

      // Clients endpoints
      if (url.includes('/clients')) {
        if (method === 'GET' && !url.match(/\/clients\/[^/]+$/)) {
          mockResponse = { clients: generateMockClients() };
        } else if (method === 'GET') {
          mockResponse = { client: generateMockClients()[0] };
        } else if (method === 'POST') {
          mockResponse = { client: { id: 'new-client', ...config.data } };
        } else if (method === 'PUT' || method === 'PATCH') {
          mockResponse = { client: { id: 'updated-client', ...config.data } };
        } else if (method === 'DELETE') {
          mockResponse = { success: true };
        }
      }

      // VAs endpoints
      if (url.includes('/vas')) {
        if (method === 'GET' && !url.match(/\/vas\/[^/]+$/)) {
          mockResponse = { vas: generateMockVAs() };
        } else if (method === 'GET') {
          mockResponse = { va: generateMockVAs()[0] };
        } else if (method === 'POST') {
          mockResponse = { va: { id: 'new-va', ...config.data } };
        } else if (method === 'PUT' || method === 'PATCH') {
          mockResponse = { va: { id: 'updated-va', ...config.data } };
        } else if (method === 'DELETE') {
          mockResponse = { success: true };
        }
      }

      // Time logs endpoints
      if (url.includes('/time-logs')) {
        if (method === 'GET') {
          mockResponse = { timeLogs: generateMockTimeLogs() };
        } else if (method === 'POST') {
          mockResponse = { timeLog: { id: 'new-log', ...config.data } };
        } else if (method === 'PUT' || method === 'PATCH') {
          mockResponse = { timeLog: { id: 'updated-log', ...config.data } };
        } else if (method === 'DELETE') {
          mockResponse = { success: true };
        }
      }

      // Invoices endpoints
      if (url.includes('/invoices')) {
        if (url.includes('/stats')) {
          mockResponse = {
            stats: {
              totalRevenue: 6500,
              totalPaid: 2000,
              totalPending: 1500,
              totalOverdue: 3000,
            }
          };
        } else if (method === 'GET') {
          mockResponse = {
            success: true,
            invoices: generateMockInvoices(),
            pagination: {
              total: 3,
              page: 1,
              pages: 1,
              limit: 10
            }
          };
        } else if (method === 'POST') {
          if (url.includes('/mark-paid')) {
            mockResponse = { success: true, invoice: { ...config.data, status: 'paid' } };
          } else {
            mockResponse = { success: true, invoice: { _id: 'new-invoice', ...config.data } };
          }
        } else if (method === 'PUT') {
          mockResponse = { success: true, invoice: { _id: 'updated-invoice', ...config.data } };
        } else if (method === 'DELETE') {
          mockResponse = { success: true, message: 'Invoice deleted successfully' };
        }
      }

      // Analytics endpoints
      if (url.includes('/analytics')) {
        mockResponse = generateMockAnalytics();
      }

      // Users endpoints
      if (url.includes('/users')) {
        if (method === 'GET') {
          mockResponse = {
            users: [
              ...generateMockClients(),
              ...generateMockVAs(),
            ]
          };
        }
      }

      // Reports endpoints
      if (url.includes('/reports')) {
        if (url.includes('/download')) {
          mockResponse = {
            success: true,
            url: 'https://example.com/report.pdf',
            expiresIn: 3600
          };
        } else if (method === 'GET' && !url.match(/\/reports\/[^\/]+$/)) {
          // GET /reports (list)
          mockResponse = {
            success: true,
            reports: generateMockReports(),
            pagination: {
              total: 3,
              page: 1,
              pages: 1,
              limit: 10
            }
          };
        } else if (method === 'GET') {
          // GET /reports/:id (single report)
          mockResponse = {
            success: true,
            report: generateMockReports()[0]
          };
        } else if (method === 'POST') {
          mockResponse = {
            success: true,
            report: { _id: 'new-report', ...config.data }
          };
        } else if (method === 'DELETE') {
          mockResponse = {
            success: true,
            message: 'Report deleted successfully'
          };
        }
      }

      // Documents endpoints
      if (url.includes('/documents')) {
        mockResponse = { documents: [] };
      }

      // Feedback endpoints
      if (url.includes('/feedback')) {
        mockResponse = { feedbacks: [] };
      }

      // Notifications endpoints
      if (url.includes('/notifications')) {
        mockResponse = { notifications: [] };
      }

      if (mockResponse) {
        // Cancel the request and return mock data
        const response = {
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };

        // Throw a custom error that will be caught by response interceptor
        const error: any = new Error('Mock response');
        error.config = config;
        error.response = response;
        error.__MOCK__ = true;
        throw error;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle mock responses
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If this is a mock response, return it as success
      if (error.__MOCK__) {
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );
};
