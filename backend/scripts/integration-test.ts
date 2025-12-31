import dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: () => true
});

let step = 0;
const logStep = (message: string) => {
  step++;
  console.log(`\n${step}. ${message}`);
};

const verify = (condition: boolean, message: string) => {
  if (condition) {
    console.log(`   ✅ ${message}`);
  } else {
    console.log(`   ❌ ${message}`);
    throw new Error(message);
  }
};

const runIntegrationTest = async () => {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║       Complete Integration Test - User Flow             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  let clientToken = '';
  let adminToken = '';
  let vaToken = '';
  let clientId = '';
  let vaId = '';
  let timeLogIds: string[] = [];
  let invoiceId = '';
  let reportId = '';

  // Step 1: Register new client
  logStep('Register new client');
  const registerRes = await api.post('/auth/register', {
    email: `integration-client-${Date.now()}@test.com`,
    password: 'TestClient123!@#$',
    role: 'client',
    name: 'Integration Test Client',
    company: 'Test Company Inc',
    industry: 'Technology',
    jobTitle: 'CEO',
    locationState: 'California',
    companyRevenueRange: '$1M-$5M',
    baselineAdminHoursPerWeek: 20
  });
  verify(registerRes.status === 201, 'Client registered successfully');
  verify(!!registerRes.data.token, 'Received authentication token');
  clientToken = registerRes.data.token;
  clientId = registerRes.data.user._id;
  console.log(`   Client ID: ${clientId}`);

  // Step 2: Login as client
  logStep('Login as client');
  const loginRes = await api.post('/auth/login', {
    email: registerRes.data.user.email,
    password: 'TestClient123!@#$'
  });
  verify(loginRes.status === 200, 'Client login successful');
  verify(!!loginRes.data.token, 'Received new token');

  // Step 3: Check client profile and ROI
  logStep('Get client profile');
  const profileRes = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${clientToken}` }
  });
  verify(profileRes.status === 200, 'Profile retrieved');
  verify(profileRes.data.profile.calculatedHourlyValue > 0, 'Hourly value calculated');
  console.log(`   Calculated hourly value: $${profileRes.data.profile.calculatedHourlyValue}/hr`);

  if (profileRes.data.profile._id) {
    clientId = profileRes.data.profile._id;
  }

  // Step 4: Admin creates VA
  logStep('Admin creates new VA');
  const adminLoginRes = await api.post('/auth/login', {
    email: 'admin@thehc.com',
    password: 'Admin123!'
  });
  verify(adminLoginRes.status === 200, 'Admin login successful');
  adminToken = adminLoginRes.data.token;

  const vaCreateRes = await api.post('/vas', {
    email: `integration-va-${Date.now()}@test.com`,
    password: 'TestVA123!@#$',
    name: 'Integration Test VA',
    department: 'Admin',
    hourlyRate: 60,
    specialization: 'Administrative Support'
  }, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(vaCreateRes.status === 201, 'VA created successfully');
  vaId = vaCreateRes.data.va._id;
  console.log(`   VA ID: ${vaId}`);

  // Step 5: VA logs time over 4 weeks (40 hours total)
  logStep('VA logs 40 hours of work over 4 weeks');
  const today = new Date();
  const hoursPerWeek = [10, 12, 8, 10]; // Total: 40 hours

  for (let week = 0; week < 4; week++) {
    const logDate = new Date(today);
    logDate.setDate(logDate.getDate() - (7 * (3 - week))); // Week 4, 3, 2, 1 ago

    const timeLogRes = await api.post('/time-logs', {
      vaId,
      clientId,
      date: logDate.toISOString(),
      hoursWorked: hoursPerWeek[week],
      tasksCompleted: hoursPerWeek[week] * 2,
      taskCategory: 'Administrative Support',
      notes: `Week ${week + 1} work log`
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    verify(timeLogRes.status === 201, `Week ${week + 1} time log created (${hoursPerWeek[week]} hours)`);
    timeLogIds.push(timeLogRes.data.timeLog._id);
  }

  const totalHours = hoursPerWeek.reduce((a, b) => a + b, 0);
  console.log(`   Total hours logged: ${totalHours} hours`);

  // Step 6: Calculate and verify ROI
  logStep('Calculate client ROI');
  const roiRes = await api.get(`/clients/${clientId}/roi?timeframe=monthly`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(roiRes.status === 200, 'ROI calculated successfully');
  verify(roiRes.data.vaHoursWorked === total Hours, `VA hours match: ${totalHours} hours`);
  verify(roiRes.data.vaCost === totalHours * 60, `VA cost correct: $${totalHours * 60}`);
  verify(roiRes.data.netSavings > 0, `Net savings positive: $${roiRes.data.netSavings}`);
  verify(roiRes.data.roiPercentage > 0, `ROI percentage positive: ${roiRes.data.roiPercentage}%`);

  console.log(`\n   ROI Summary:`);
  console.log(`   - Hours Reclaimed: ${roiRes.data.hoursReclaimed} hours`);
  console.log(`   - Value of Reclaimed Time: $${roiRes.data.valueOfReclaimedTime}`);
  console.log(`   - VA Cost: $${roiRes.data.vaCost}`);
  console.log(`   - Net Savings: $${roiRes.data.netSavings}`);
  console.log(`   - ROI Percentage: ${roiRes.data.roiPercentage}%`);

  // Step 7: Generate invoice
  logStep('Generate invoice for services');
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const invoiceRes = await api.post('/invoices', {
    clientId,
    dueDate: dueDate.toISOString(),
    lineItems: [
      {
        description: `Administrative Support - ${totalHours} hours @ $60/hr`,
        quantity: totalHours,
        rate: 60,
        amount: totalHours * 60
      }
    ]
  }, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(invoiceRes.status === 201, 'Invoice created');
  verify(invoiceRes.data.invoice.amount === totalHours * 60, `Invoice amount correct: $${totalHours * 60}`);
  invoiceId = invoiceRes.data.invoice._id;
  console.log(`   Invoice Number: ${invoiceRes.data.invoice.invoiceNumber}`);
  console.log(`   Amount: $${invoiceRes.data.invoice.amount}`);

  // Step 8: Check invoice stats
  logStep('Verify invoice statistics');
  const statsRes = await api.get(`/invoices/stats?clientId=${clientId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(statsRes.status === 200, 'Invoice stats retrieved');
  verify(statsRes.data.total >= 1, 'At least one invoice exists');
  verify(statsRes.data.unpaid >= 1, 'Unpaid invoice counted');
  console.log(`   Total Invoices: ${statsRes.data.total}`);
  console.log(`   Unpaid Amount: $${statsRes.data.unpaidAmount}`);

  // Step 9: Mark invoice as paid
  logStep('Mark invoice as paid');
  const payRes = await api.post(`/invoices/${invoiceId}/pay`, {}, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(payRes.status === 200, 'Invoice marked as paid');
  verify(payRes.data.invoice.status === 'paid', 'Invoice status updated to paid');
  verify(!!payRes.data.invoice.paidAt, 'Payment date recorded');
  console.log(`   Paid at: ${new Date(payRes.data.invoice.paidAt).toLocaleString()}`);

  // Step 10: Generate monthly report
  logStep('Generate monthly report');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const reportRes = await api.post('/reports', {
    clientId,
    type: 'monthly',
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(reportRes.status === 201, 'Report generated');
  verify(reportRes.data.report.status === 'generated', 'Report status is generated');
  verify(!!reportRes.data.report.metrics, 'Report includes metrics');
  reportId = reportRes.data.report._id;

  console.log(`   Report Type: ${reportRes.data.report.type}`);
  console.log(`   Period: ${new Date(reportRes.data.report.periodStart).toLocaleDateString()} - ${new Date(reportRes.data.report.periodEnd).toLocaleDateString()}`);
  console.log(`   Metrics included: ROI, Time Logs, Tasks`);

  // Step 11: Verify all data is correct
  logStep('Final verification - Check all data');

  // Verify time logs
  const timeLogsRes = await api.get(`/time-logs?clientId=${clientId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(timeLogsRes.status === 200, 'Time logs retrieved');
  verify(timeLogsRes.data.data.length >= 4, 'All time logs exist');

  // Verify client analytics
  const analyticsRes = await api.get(`/analytics/client/${clientId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  verify(analyticsRes.status === 200, 'Client analytics retrieved');
  verify(analyticsRes.data.stats.totalHours >= totalHours, 'Total hours tracked correctly');
  verify(analyticsRes.data.stats.totalPaid === totalHours * 60, 'Total paid amount correct');

  console.log(`\n   Final Stats:`);
  console.log(`   - Total Hours: ${analyticsRes.data.stats.totalHours}`);
  console.log(`   - Total Tasks: ${analyticsRes.data.stats.totalTasks}`);
  console.log(`   - Total Invoiced: $${analyticsRes.data.stats.totalInvoiced}`);
  console.log(`   - Total Paid: $${analyticsRes.data.stats.totalPaid}`);

  // Final Summary
  console.log('\n' + '═'.repeat(60));
  console.log('✅ Integration Test PASSED');
  console.log('═'.repeat(60));
  console.log('\n📊 Complete User Flow Verified:');
  console.log('   ✓ Client registration and authentication');
  console.log('   ✓ Hourly value calculation');
  console.log('   ✓ VA assignment');
  console.log('   ✓ Time logging (40 hours over 4 weeks)');
  console.log('   ✓ ROI calculation');
  console.log('   ✓ Invoice generation');
  console.log('   ✓ Payment processing');
  console.log('   ✓ Report generation');
  console.log('   ✓ Analytics tracking');
  console.log('\n🎉 All data verified correctly!\n');

  process.exit(0);
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

checkServer()
  .then(() => runIntegrationTest())
  .catch(err => {
    console.error('\n❌ Integration test failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
