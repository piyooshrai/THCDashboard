import dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';

let authToken = '';
let adminToken = '';
let clientId = '';
let vaId = '';
let timeLogId = '';
let invoiceId = '';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const log = (message: string, success = true) => {
  console.log(success ? `✅ ${message}` : `❌ ${message}`);
};

const testEndpoint = async (name: string, fn: () => Promise<any>) => {
  try {
    await fn();
    log(name);
  } catch (error: any) {
    log(`${name} - ${error.message}`, false);
  }
};

const runTests = async () => {
  console.log('\n🚀 Starting API Endpoint Verification\n');
  console.log('='.repeat(50));

  // Health Check
  console.log('\n📡 Health Check');
  console.log('-'.repeat(50));
  await testEndpoint('GET /health', async () => {
    const res = await api.get('/health');
    if (res.status !== 200) throw new Error('Health check failed');
  });

  // Authentication
  console.log('\n🔐 Authentication');
  console.log('-'.repeat(50));

  await testEndpoint('POST /auth/register (Admin)', async () => {
    const res = await api.post('/auth/register', {
      email: `admin-${Date.now()}@test.com`,
      password: 'Admin123!',
      role: 'admin'
    });
    adminToken = res.data.token;
  });

  await testEndpoint('POST /auth/register (Client)', async () => {
    const res = await api.post('/auth/register', {
      email: `client-${Date.now()}@test.com`,
      password: 'Client123!',
      role: 'client',
      name: 'Test Client',
      industry: 'Technology',
      jobTitle: 'CEO',
      locationState: 'California',
      companyRevenueRange: '$1M-$5M'
    });
    authToken = res.data.token;
  });

  await testEndpoint('POST /auth/login', async () => {
    const res = await api.post('/auth/login', {
      email: 'admin@thehc.com',
      password: 'Admin123!'
    });
    if (!res.data.token) throw new Error('No token received');
  });

  await testEndpoint('GET /auth/profile', async () => {
    const res = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    clientId = res.data.profile._id;
  });

  // Users
  console.log('\n👥 Users');
  console.log('-'.repeat(50));

  await testEndpoint('GET /users', async () => {
    const res = await api.get('/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of users');
  });

  // Clients
  console.log('\n🏢 Clients');
  console.log('-'.repeat(50));

  await testEndpoint('GET /clients', async () => {
    const res = await api.get('/clients', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of clients');
  });

  await testEndpoint('GET /clients/:id', async () => {
    await api.get(`/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  await testEndpoint('GET /clients/:id/roi', async () => {
    await api.get(`/clients/${clientId}/roi`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  // VAs
  console.log('\n🎯 Virtual Assistants');
  console.log('-'.repeat(50));

  await testEndpoint('POST /vas', async () => {
    const res = await api.post('/vas', {
      email: `va-${Date.now()}@test.com`,
      password: 'VA123!',
      name: 'Test VA',
      department: 'Admin',
      hourlyRate: 60
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    vaId = res.data.va._id;
  });

  await testEndpoint('GET /vas', async () => {
    const res = await api.get('/vas', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of VAs');
  });

  await testEndpoint('GET /vas/:id/performance', async () => {
    await api.get(`/vas/${vaId}/performance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  // Time Logs
  console.log('\n⏰ Time Logs');
  console.log('-'.repeat(50));

  await testEndpoint('POST /time-logs', async () => {
    const res = await api.post('/time-logs', {
      vaId,
      clientId,
      date: new Date().toISOString(),
      hoursWorked: 5,
      tasksCompleted: 10,
      notes: 'Test time log'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    timeLogId = res.data.timeLog._id;
  });

  await testEndpoint('GET /time-logs', async () => {
    const res = await api.get('/time-logs', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of time logs');
  });

  await testEndpoint('GET /time-logs/summary', async () => {
    await api.get('/time-logs/summary', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  // Invoices
  console.log('\n💰 Invoices');
  console.log('-'.repeat(50));

  await testEndpoint('POST /invoices', async () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const res = await api.post('/invoices', {
      clientId,
      dueDate: dueDate.toISOString(),
      lineItems: [
        {
          description: 'Test Service',
          quantity: 5,
          rate: 60,
          amount: 300
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    invoiceId = res.data.invoice._id;
  });

  await testEndpoint('GET /invoices', async () => {
    const res = await api.get('/invoices', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of invoices');
  });

  await testEndpoint('GET /invoices/stats', async () => {
    await api.get('/invoices/stats', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  // Reports
  console.log('\n📊 Reports');
  console.log('-'.repeat(50));

  await testEndpoint('POST /reports', async () => {
    await api.post('/reports', {
      clientId,
      type: 'monthly',
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      periodEnd: new Date().toISOString()
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  });

  await testEndpoint('GET /reports', async () => {
    const res = await api.get('/reports', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of reports');
  });

  // Feedback
  console.log('\n⭐ Feedback');
  console.log('-'.repeat(50));

  await testEndpoint('POST /feedback', async () => {
    await api.post('/feedback', {
      vaId,
      rating: 5,
      comment: 'Excellent work!'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  await testEndpoint('GET /feedback', async () => {
    const res = await api.get('/feedback', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of feedback');
  });

  // Notifications
  console.log('\n🔔 Notifications');
  console.log('-'.repeat(50));

  await testEndpoint('GET /notifications', async () => {
    const res = await api.get('/notifications', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of notifications');
  });

  // Analytics
  console.log('\n📈 Analytics');
  console.log('-'.repeat(50));

  await testEndpoint('GET /analytics/dashboard', async () => {
    await api.get('/analytics/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  });

  await testEndpoint('GET /analytics/revenue-by-month', async () => {
    await api.get('/analytics/revenue-by-month', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  });

  await testEndpoint('GET /analytics/top-vas', async () => {
    await api.get('/analytics/top-vas', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  });

  await testEndpoint('GET /analytics/client/:clientId', async () => {
    await api.get(`/analytics/client/${clientId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  });

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ API Verification Complete!\n');
};

runTests().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
