import dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';

// Test state
let passed = 0;
let failed = 0;
let adminToken = '';
let clientToken = '';
let vaToken = '';
let testClientId = '';
let testVAId = '';
let testTimeLogId = '';
let testInvoiceId = '';
let testReportId = '';
let testFeedbackId = '';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: () => true // Don't throw on any status
});

const log = (message: string, success = true) => {
  console.log(success ? `✅ ${message}` : `❌ ${message}`);
};

const testEndpoint = async (
  name: string,
  fn: () => Promise<any>,
  expectedStatus?: number
): Promise<boolean> => {
  try {
    const result = await fn();

    if (expectedStatus && result.status !== expectedStatus) {
      log(`${name} - Expected ${expectedStatus}, got ${result.status}`, false);
      failed++;
      return false;
    }

    log(name);
    passed++;
    return true;
  } catch (error: any) {
    log(`${name} - ${error.message}`, false);
    failed++;
    return false;
  }
};

const runTests = async () => {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   The Human Capital - Complete API Verification         ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Phase 1: Health & Auth
  console.log('📡 Phase 1: Health Check & Authentication');
  console.log('─'.repeat(60));

  await testEndpoint('GET /health', async () => {
    const res = await api.get('/health');
    if (res.status !== 200) throw new Error('Health check failed');
    return res;
  }, 200);

  await testEndpoint('POST /auth/register (Admin)', async () => {
    const res = await api.post('/auth/register', {
      email: `admin-test-${Date.now()}@test.com`,
      password: 'Admin123!@#$SecurePassword',
      role: 'admin'
    });
    if (res.status !== 201 || !res.data.token) throw new Error('Failed to register admin');
    adminToken = res.data.token;
    return res;
  }, 201);

  await testEndpoint('POST /auth/register (Client)', async () => {
    const res = await api.post('/auth/register', {
      email: `client-test-${Date.now()}@test.com`,
      password: 'Client123!@#$SecurePassword',
      role: 'client',
      name: 'Test Client',
      industry: 'Technology',
      jobTitle: 'CEO',
      locationState: 'California',
      companyRevenueRange: '$1M-$5M'
    });
    if (res.status !== 201 || !res.data.token) throw new Error('Failed to register client');
    clientToken = res.data.token;
    return res;
  }, 201);

  await testEndpoint('POST /auth/login (Seeded Admin)', async () => {
    const res = await api.post('/auth/login', {
      email: 'admin@thehc.com',
      password: 'Admin123!'
    });
    if (res.status !== 200 || !res.data.token) throw new Error('Failed to login');
    // Keep the newly registered admin token for testing
    return res;
  }, 200);

  await testEndpoint('GET /auth/profile', async () => {
    const res = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    if (res.status !== 200 || !res.data.user) throw new Error('Failed to get profile');
    if (res.data.profile) {
      testClientId = res.data.profile._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /auth/refresh-token', async () => {
    const res = await api.post('/auth/refresh-token', {
      refreshToken: 'dummy-token-for-test'
    });
    // This should fail with 401 as expected
    return res;
  }, 401);

  await testEndpoint('POST /auth/logout', async () => {
    const res = await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    return res;
  }, 200);

  // Phase 2: User Management
  console.log('\n👥 Phase 2: User Management (Admin Only)');
  console.log('─'.repeat(60));

  await testEndpoint('GET /users (list all)', async () => {
    const res = await api.get('/users?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list users');
    }
    return res;
  }, 200);

  await testEndpoint('GET /users/:id (specific user)', async () => {
    const res = await api.get(`/users/${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PUT /users/:id (update user)', async () => {
    const res = await api.put(`/users/${testClientId}`, {
      status: 'active'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PATCH /users/:id/toggle-status', async () => {
    const res = await api.patch(`/users/${testClientId}/toggle-status`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  // Phase 3: Client Management
  console.log('\n🏢 Phase 3: Client Management');
  console.log('─'.repeat(60));

  await testEndpoint('GET /clients (list all)', async () => {
    const res = await api.get('/clients?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list clients');
    }
    // Get first client ID for tests
    if (res.data.data.length > 0 && !testClientId) {
      testClientId = res.data.data[0]._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /clients (create)', async () => {
    const res = await api.post('/clients', {
      email: `newclient-${Date.now()}@test.com`,
      password: 'Client123!@#$',
      name: 'New Test Client',
      industry: 'Healthcare',
      jobTitle: 'Healthcare Administrator',
      locationState: 'New York'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status === 201 && res.data.client) {
      testClientId = res.data.client._id;
    }
    return res;
  }, 201);

  await testEndpoint('GET /clients/:id (specific)', async () => {
    const res = await api.get(`/clients/${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PUT /clients/:id (update)', async () => {
    const res = await api.put(`/clients/${testClientId}`, {
      company: 'Updated Company Name'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('GET /clients/:id/roi', async () => {
    const res = await api.get(`/clients/${testClientId}/roi?timeframe=monthly`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('POST /clients/:id/recalculate-hourly-value', async () => {
    const res = await api.post(`/clients/${testClientId}/recalculate-hourly-value`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  // Phase 4: VA Management
  console.log('\n🎯 Phase 4: Virtual Assistant Management');
  console.log('─'.repeat(60));

  await testEndpoint('GET /vas (list all)', async () => {
    const res = await api.get('/vas?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list VAs');
    }
    if (res.data.data.length > 0) {
      testVAId = res.data.data[0]._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /vas (create)', async () => {
    const res = await api.post('/vas', {
      email: `newva-${Date.now()}@test.com`,
      password: 'VA123!@#$',
      name: 'New Test VA',
      department: 'Admin',
      hourlyRate: 60,
      specialization: 'Administrative Support'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status === 201 && res.data.va) {
      testVAId = res.data.va._id;
      // Create user account for VA login test
      const vaLoginRes = await api.post('/auth/login', {
        email: `newva-${Date.now()}@test.com`,
        password: 'VA123!@#$'
      });
      // This will fail since we can't reuse the email, but that's OK
    }
    return res;
  }, 201);

  await testEndpoint('GET /vas/:id (specific)', async () => {
    const res = await api.get(`/vas/${testVAId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PUT /vas/:id (update)', async () => {
    const res = await api.put(`/vas/${testVAId}`, {
      specialization: 'Advanced Admin Support'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('GET /vas/:id/performance', async () => {
    const res = await api.get(`/vas/${testVAId}/performance`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !res.data.performance) {
      throw new Error('Failed to get VA performance');
    }
    return res;
  }, 200);

  // Phase 5: Time Logs
  console.log('\n⏰ Phase 5: Time Log Management');
  console.log('─'.repeat(60));

  await testEndpoint('GET /time-logs (list all)', async () => {
    const res = await api.get('/time-logs?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list time logs');
    }
    if (res.data.data.length > 0) {
      testTimeLogId = res.data.data[0]._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /time-logs (create)', async () => {
    const res = await api.post('/time-logs', {
      vaId: testVAId,
      clientId: testClientId,
      date: new Date().toISOString(),
      hoursWorked: 5,
      tasksCompleted: 10,
      taskCategory: 'Email Management',
      notes: 'Test time log entry'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status === 201 && res.data.timeLog) {
      testTimeLogId = res.data.timeLog._id;
    }
    return res;
  }, 201);

  await testEndpoint('GET /time-logs/:id (specific)', async () => {
    const res = await api.get(`/time-logs/${testTimeLogId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PUT /time-logs/:id (update)', async () => {
    const res = await api.put(`/time-logs/${testTimeLogId}`, {
      hoursWorked: 6,
      notes: 'Updated time log'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('GET /time-logs/summary', async () => {
    const res = await api.get(`/time-logs/summary?clientId=${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  // Phase 6: Invoices
  console.log('\n💰 Phase 6: Invoice Management');
  console.log('─'.repeat(60));

  await testEndpoint('GET /invoices (list all)', async () => {
    const res = await api.get('/invoices?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list invoices');
    }
    if (res.data.data.length > 0) {
      testInvoiceId = res.data.data[0]._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /invoices (create)', async () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const res = await api.post('/invoices', {
      clientId: testClientId,
      dueDate: dueDate.toISOString(),
      lineItems: [
        {
          description: 'Test Service - January 2025',
          quantity: 10,
          rate: 60,
          amount: 600
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status === 201 && res.data.invoice) {
      testInvoiceId = res.data.invoice._id;
    }
    return res;
  }, 201);

  await testEndpoint('GET /invoices/:id (specific)', async () => {
    const res = await api.get(`/invoices/${testInvoiceId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PUT /invoices/:id (update)', async () => {
    const res = await api.put(`/invoices/${testInvoiceId}`, {
      status: 'unpaid'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('POST /invoices/:id/pay (mark paid)', async () => {
    const res = await api.post(`/invoices/${testInvoiceId}/pay`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('GET /invoices/stats', async () => {
    const res = await api.get(`/invoices/stats?clientId=${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  // Phase 7: Reports
  console.log('\n📊 Phase 7: Report Generation');
  console.log('─'.repeat(60));

  await testEndpoint('GET /reports (list all)', async () => {
    const res = await api.get('/reports?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list reports');
    }
    if (res.data.data.length > 0) {
      testReportId = res.data.data[0]._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /reports (generate)', async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const res = await api.post('/reports', {
      clientId: testClientId,
      type: 'monthly',
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString()
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status === 201 && res.data.report) {
      testReportId = res.data.report._id;
    }
    return res;
  }, 201);

  await testEndpoint('GET /reports/:id (specific)', async () => {
    const res = await api.get(`/reports/${testReportId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('GET /reports/:id/download', async () => {
    const res = await api.get(`/reports/${testReportId}/download`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  // Phase 8: Documents (Skip actual file upload for now)
  console.log('\n📄 Phase 8: Document Management');
  console.log('─'.repeat(60));

  await testEndpoint('GET /documents (list all)', async () => {
    const res = await api.get('/documents?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list documents');
    }
    return res;
  }, 200);

  // Note: Actual file upload test would require multipart/form-data
  console.log('⚠️  Skipping POST /documents (requires multipart/form-data)');
  console.log('⚠️  Skipping GET /documents/:id/download (no test documents)');
  console.log('⚠️  Skipping DELETE /documents/:id (no test documents)');

  // Phase 9: Feedback
  console.log('\n⭐ Phase 9: Feedback System');
  console.log('─'.repeat(60));

  await testEndpoint('GET /feedback (list all)', async () => {
    const res = await api.get('/feedback?page=1&limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list feedback');
    }
    if (res.data.data.length > 0) {
      testFeedbackId = res.data.data[0]._id;
    }
    return res;
  }, 200);

  await testEndpoint('POST /feedback (create)', async () => {
    const res = await api.post('/feedback', {
      vaId: testVAId,
      rating: 5,
      comment: 'Excellent work! Very professional.'
    }, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    if (res.status === 201 && res.data.feedback) {
      testFeedbackId = res.data.feedback._id;
    }
    return res;
  }, 201);

  await testEndpoint('GET /feedback/:id (specific)', async () => {
    const res = await api.get(`/feedback/${testFeedbackId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('PUT /feedback/:id (update)', async () => {
    const res = await api.put(`/feedback/${testFeedbackId}`, {
      rating: 4,
      comment: 'Updated feedback comment'
    }, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('GET /feedback/va/:vaId/stats', async () => {
    const res = await api.get(`/feedback/va/${testVAId}/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200) throw new Error('Failed to get VA feedback stats');
    return res;
  }, 200);

  // Phase 10: Notifications
  console.log('\n🔔 Phase 10: Notification System');
  console.log('─'.repeat(60));

  await testEndpoint('GET /notifications (list mine)', async () => {
    const res = await api.get('/notifications?page=1&limit=10', {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data.data)) {
      throw new Error('Failed to list notifications');
    }
    return res;
  }, 200);

  await testEndpoint('POST /notifications (admin create)', async () => {
    const res = await api.post('/notifications', {
      userId: testClientId,
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification',
      link: '/dashboard'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 201);

  await testEndpoint('PATCH /notifications/read-all', async () => {
    const res = await api.patch('/notifications/read-all', {}, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    return res;
  }, 200);

  // Phase 11: Analytics
  console.log('\n📈 Phase 11: Analytics Dashboard');
  console.log('─'.repeat(60));

  await testEndpoint('GET /analytics/dashboard', async () => {
    const res = await api.get('/analytics/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200) throw new Error('Failed to get dashboard analytics');
    return res;
  }, 200);

  await testEndpoint('GET /analytics/revenue-by-month', async () => {
    const res = await api.get('/analytics/revenue-by-month?months=12', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data)) {
      throw new Error('Failed to get revenue by month');
    }
    return res;
  }, 200);

  await testEndpoint('GET /analytics/top-vas', async () => {
    const res = await api.get('/analytics/top-vas?limit=10', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200 || !Array.isArray(res.data)) {
      throw new Error('Failed to get top VAs');
    }
    return res;
  }, 200);

  await testEndpoint('GET /analytics/client/:clientId', async () => {
    const res = await api.get(`/analytics/client/${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200) throw new Error('Failed to get client analytics');
    return res;
  }, 200);

  await testEndpoint('GET /analytics/va/:vaId', async () => {
    const res = await api.get(`/analytics/va/${testVAId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.status !== 200) throw new Error('Failed to get VA analytics');
    return res;
  }, 200);

  // Phase 12: Delete Operations (Cleanup)
  console.log('\n🗑️  Phase 12: Delete Operations (Cleanup)');
  console.log('─'.repeat(60));

  await testEndpoint('DELETE /feedback/:id', async () => {
    const res = await api.delete(`/feedback/${testFeedbackId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('DELETE /time-logs/:id', async () => {
    const res = await api.delete(`/time-logs/${testTimeLogId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('DELETE /invoices/:id', async () => {
    const res = await api.delete(`/invoices/${testInvoiceId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('DELETE /reports/:id', async () => {
    const res = await api.delete(`/reports/${testReportId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('DELETE /vas/:id', async () => {
    const res = await api.delete(`/vas/${testVAId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  await testEndpoint('DELETE /clients/:id', async () => {
    const res = await api.delete(`/clients/${testClientId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    return res;
  }, 200);

  // Final Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('═'.repeat(60));

  const total = passed + failed;
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${percentage}%`);
  console.log(`\nTotal Endpoints Tested: ${total}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! The API is fully functional.\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed. Please review the errors above.\n`);
    process.exit(1);
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    await api.get('/health');
  } catch (error) {
    console.error('\n❌ Cannot connect to API server at', BASE_URL);
    console.error('Please ensure the server is running with: npm run dev\n');
    process.exit(1);
  }
};

checkServer().then(() => runTests()).catch(err => {
  console.error('\n❌ Verification failed with error:', err.message);
  process.exit(1);
});
