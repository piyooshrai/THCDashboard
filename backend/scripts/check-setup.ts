import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { execSync } from 'child_process';

dotenv.config();

const log = (message: string, success = true) => {
  console.log(success ? `✅ ${message}` : `❌ ${message}`);
};

const error = (message: string) => {
  console.error(`❌ ${message}`);
};

let hasErrors = false;

const checkEnvFile = (): boolean => {
  console.log('\n📄 Checking Environment File...');
  console.log('='.repeat(50));

  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    error('.env file not found');
    error('Please copy .env.example to .env and configure it');
    return false;
  }

  log('.env file exists');
  return true;
};

const checkRequiredEnvVars = (): boolean => {
  console.log('\n🔧 Checking Required Environment Variables...');
  console.log('='.repeat(50));

  const required = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_EXPIRES_IN'
  ];

  const optional = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET',
    'AWS_REGION',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  let allPresent = true;

  for (const varName of required) {
    if (!process.env[varName]) {
      error(`Missing required variable: ${varName}`);
      allPresent = false;
      hasErrors = true;
    } else {
      log(`${varName} is set`);
    }
  }

  // Check JWT secret lengths
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    error('JWT_SECRET must be at least 32 characters long');
    allPresent = false;
    hasErrors = true;
  } else if (process.env.JWT_SECRET) {
    log(`JWT_SECRET is ${process.env.JWT_SECRET.length} characters (✓ >= 32)`);
  }

  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    error('JWT_REFRESH_SECRET must be at least 32 characters long');
    allPresent = false;
    hasErrors = true;
  } else if (process.env.JWT_REFRESH_SECRET) {
    log(`JWT_REFRESH_SECRET is ${process.env.JWT_REFRESH_SECRET.length} characters (✓ >= 32)`);
  }

  // Check MongoDB URI format
  if (process.env.MONGODB_URI) {
    if (process.env.MONGODB_URI.startsWith('mongodb://') || process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
      log('MONGODB_URI has valid format');
    } else {
      error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
      allPresent = false;
      hasErrors = true;
    }
  }

  console.log('\n⚠️  Optional Variables (for advanced features):');
  for (const varName of optional) {
    if (process.env[varName]) {
      console.log(`   ✓ ${varName} is set`);
    } else {
      console.log(`   - ${varName} is not set (optional)`);
    }
  }

  return allPresent;
};

const checkMongoDBConnection = async (): Promise<boolean> => {
  console.log('\n🗄️  Checking MongoDB Connection...');
  console.log('='.repeat(50));

  if (!process.env.MONGODB_URI) {
    error('Cannot test MongoDB connection - MONGODB_URI not set');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log('MongoDB connection successful');
    log(`Database: ${mongoose.connection.name}`);
    await mongoose.disconnect();
    return true;
  } catch (err: any) {
    error(`MongoDB connection failed: ${err.message}`);
    hasErrors = true;
    return false;
  }
};

const checkTypeScriptCompilation = (): boolean => {
  console.log('\n🔨 Checking TypeScript Compilation...');
  console.log('='.repeat(50));

  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
    log('TypeScript compilation successful (no errors)');
    return true;
  } catch (err: any) {
    error('TypeScript compilation failed');
    console.error(err.stdout?.toString() || err.message);
    hasErrors = true;
    return false;
  }
};

const checkDependencies = (): boolean => {
  console.log('\n📦 Checking Dependencies...');
  console.log('='.repeat(50));

  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    error('node_modules directory not found');
    error('Please run: npm install');
    hasErrors = true;
    return false;
  }

  log('node_modules directory exists');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    log(`${dependencies.length} production dependencies`);
    log(`${devDependencies.length} development dependencies`);

    // Check critical dependencies
    const critical = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'dotenv'];
    for (const dep of critical) {
      const depPath = path.join(nodeModulesPath, dep);
      if (fs.existsSync(depPath)) {
        log(`✓ ${dep} installed`);
      } else {
        error(`✗ ${dep} NOT installed`);
        hasErrors = true;
      }
    }

    return true;
  } catch (err: any) {
    error(`Failed to check dependencies: ${err.message}`);
    hasErrors = true;
    return false;
  }
};

const listRoutes = () => {
  console.log('\n🛣️  Registered Routes:');
  console.log('='.repeat(50));

  const routes = [
    'POST   /api/v1/auth/register',
    'POST   /api/v1/auth/login',
    'POST   /api/v1/auth/refresh-token',
    'GET    /api/v1/auth/profile',
    'POST   /api/v1/auth/logout',
    '',
    'GET    /api/v1/users',
    'GET    /api/v1/users/:id',
    'PUT    /api/v1/users/:id',
    'DELETE /api/v1/users/:id',
    'PATCH  /api/v1/users/:id/toggle-status',
    '',
    'GET    /api/v1/clients',
    'GET    /api/v1/clients/:id',
    'POST   /api/v1/clients',
    'PUT    /api/v1/clients/:id',
    'DELETE /api/v1/clients/:id',
    'GET    /api/v1/clients/:id/roi',
    'POST   /api/v1/clients/:id/recalculate-hourly-value',
    '',
    'GET    /api/v1/vas',
    'GET    /api/v1/vas/:id',
    'POST   /api/v1/vas',
    'PUT    /api/v1/vas/:id',
    'DELETE /api/v1/vas/:id',
    'GET    /api/v1/vas/:id/performance',
    '',
    'GET    /api/v1/time-logs',
    'GET    /api/v1/time-logs/summary',
    'GET    /api/v1/time-logs/:id',
    'POST   /api/v1/time-logs',
    'PUT    /api/v1/time-logs/:id',
    'DELETE /api/v1/time-logs/:id',
    '',
    'GET    /api/v1/invoices',
    'GET    /api/v1/invoices/stats',
    'GET    /api/v1/invoices/:id',
    'POST   /api/v1/invoices',
    'PUT    /api/v1/invoices/:id',
    'DELETE /api/v1/invoices/:id',
    'POST   /api/v1/invoices/:id/pay',
    '',
    'GET    /api/v1/reports',
    'GET    /api/v1/reports/:id',
    'POST   /api/v1/reports',
    'DELETE /api/v1/reports/:id',
    'GET    /api/v1/reports/:id/download',
    '',
    'GET    /api/v1/documents',
    'GET    /api/v1/documents/:id',
    'POST   /api/v1/documents',
    'DELETE /api/v1/documents/:id',
    'GET    /api/v1/documents/:id/download',
    '',
    'GET    /api/v1/feedback',
    'GET    /api/v1/feedback/:id',
    'POST   /api/v1/feedback',
    'PUT    /api/v1/feedback/:id',
    'DELETE /api/v1/feedback/:id',
    'GET    /api/v1/feedback/va/:vaId/stats',
    '',
    'GET    /api/v1/notifications',
    'GET    /api/v1/notifications/:id',
    'POST   /api/v1/notifications',
    'PATCH  /api/v1/notifications/:id/read',
    'PATCH  /api/v1/notifications/read-all',
    'DELETE /api/v1/notifications/:id',
    'DELETE /api/v1/notifications/read-all',
    '',
    'GET    /api/v1/analytics/dashboard',
    'GET    /api/v1/analytics/revenue-by-month',
    'GET    /api/v1/analytics/top-vas',
    'GET    /api/v1/analytics/client/:clientId',
    'GET    /api/v1/analytics/va/:vaId'
  ];

  routes.forEach(route => {
    if (route === '') {
      console.log('');
    } else {
      console.log(`   ${route}`);
    }
  });

  const totalEndpoints = routes.filter(r => r !== '').length;
  console.log(`\n📊 Total: ${totalEndpoints} endpoints`);
};

const runChecks = async () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   The Human Capital - Setup Verification      ║');
  console.log('╚════════════════════════════════════════════════╝');

  const envFileExists = checkEnvFile();
  if (!envFileExists) {
    console.log('\n❌ Setup check FAILED - .env file missing');
    process.exit(1);
  }

  const envVarsOk = checkRequiredEnvVars();
  const depsOk = checkDependencies();
  const tsOk = checkTypeScriptCompilation();
  const dbOk = await checkMongoDBConnection();

  listRoutes();

  console.log('\n' + '='.repeat(50));
  console.log('📋 Summary:');
  console.log('='.repeat(50));
  console.log(`Environment Variables:  ${envVarsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Dependencies:           ${depsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`TypeScript Compilation: ${tsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`MongoDB Connection:     ${dbOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(50));

  if (hasErrors || !envVarsOk || !depsOk || !tsOk || !dbOk) {
    console.log('\n❌ Setup verification FAILED');
    console.log('Please fix the errors above before proceeding.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed! Backend is ready to run.');
    console.log('\nNext steps:');
    console.log('  npm run seed       - Seed database with sample data');
    console.log('  npm run dev        - Start development server');
    console.log('  npm run verify     - Test all API endpoints\n');
    process.exit(0);
  }
};

runChecks().catch(err => {
  console.error('\n❌ Setup check failed with error:', err.message);
  process.exit(1);
});
