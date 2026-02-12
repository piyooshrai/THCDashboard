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
    id: 'inv-1',
    clientId: 'client-1',
    amount: 2000,
    status: 'paid',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-2',
    clientId: 'client-2',
    amount: 1500,
    status: 'pending',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
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
        if (method === 'GET') {
          mockResponse = { invoices: generateMockInvoices() };
        } else if (method === 'POST') {
          mockResponse = { invoice: { id: 'new-invoice', ...config.data } };
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
        mockResponse = {
          report: {
            totalHours: 14,
            totalRevenue: 3500,
            timeLogs: generateMockTimeLogs(),
          }
        };
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
