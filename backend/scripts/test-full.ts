import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn, ChildProcess, execSync } from 'child_process';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';

dotenv.config();

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitForServer = async (url: string, maxAttempts: number = 30): Promise<boolean> => {
  console.log(`⏳ Waiting for server at ${url}...`);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(`${url}/health`, { timeout: 1000 });
      console.log(`✅ Server is ready!`);
      return true;
    } catch (error) {
      await wait(1000);
      process.stdout.write('.');
    }
  }

  console.log(`\n❌ Server did not start within ${maxAttempts} seconds`);
  return false;
};

const runCommand = (command: string, env: NodeJS.ProcessEnv): Promise<{ code: number; output: string }> => {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      stdio: 'inherit',
      env,
      cwd: path.join(__dirname, '..')
    });

    let output = '';

    child.on('close', (code) => {
      resolve({ code: code || 0, output });
    });

    child.on('error', (error) => {
      console.error('Command error:', error);
      resolve({ code: 1, output: error.message });
    });
  });
};

const runFullTest = async () => {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     Complete Backend Test Suite - Comprehensive         ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  let mongoServer: MongoMemoryServer | null = null;
  let apiServer: ChildProcess | null = null;
  const BASE_URL = 'http://localhost:5000/api/v1';

  try {
    // Phase 0: Start in-memory MongoDB
    console.log('═'.repeat(60));
    console.log('Phase 0: Starting In-Memory MongoDB');
    console.log('═'.repeat(60));

    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'thehuman_capital_test'
      },
      binary: {
        version: '7.0.0'
      }
    });

    const mongoUri = mongoServer.getUri();
    console.log(`✅ MongoDB started at: ${mongoUri}\n`);

    const testEnv = {
      ...process.env,
      MONGODB_URI: mongoUri,
      NODE_ENV: 'test',
      PORT: '5000'
    };

    // Phase 1: Setup Check
    console.log('═'.repeat(60));
    console.log('Phase 1: Setup Verification');
    console.log('═'.repeat(60));

    const checkResult = await runCommand('ts-node scripts/check-setup.ts', testEnv);

    if (checkResult.code !== 0) {
      throw new Error('Setup verification failed');
    }

    // Phase 2: Database Seed
    console.log('\n═'.repeat(60));
    console.log('Phase 2: Database Seeding');
    console.log('═'.repeat(60));

    const seedResult = await runCommand('ts-node scripts/seed.ts', testEnv);

    if (seedResult.code !== 0) {
      throw new Error('Database seeding failed');
    }

    // Phase 3: Start API Server
    console.log('\n═'.repeat(60));
    console.log('Phase 3: Starting API Server');
    console.log('═'.repeat(60));

    apiServer = spawn('ts-node', ['src/server.ts'], {
      env: testEnv,
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });

    // Capture server logs
    apiServer.stdout?.on('data', (data) => {
      process.stdout.write(`[SERVER] ${data}`);
    });

    apiServer.stderr?.on('data', (data) => {
      process.stderr.write(`[SERVER ERROR] ${data}`);
    });

    // Wait for server to be ready
    const serverReady = await waitForServer(BASE_URL, 30);

    if (!serverReady) {
      throw new Error('API server failed to start');
    }

    // Phase 4: Endpoint Verification
    console.log('\n═'.repeat(60));
    console.log('Phase 4: Endpoint Verification (50+ endpoints)');
    console.log('═'.repeat(60));

    const verifyEnv = { ...testEnv, BASE_URL };
    const verifyResult = await runCommand('ts-node scripts/verify.ts', verifyEnv);

    // Phase 5: Integration Test
    console.log('\n═'.repeat(60));
    console.log('Phase 5: Integration Test (Complete User Flow)');
    console.log('═'.repeat(60));

    const integrationResult = await runCommand('ts-node scripts/integration-test.ts', verifyEnv);

    // Final Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 COMPREHENSIVE TEST SUITE SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Setup Verification:    PASSED`);
    console.log(`✅ Database Seeding:      PASSED`);
    console.log(`✅ API Server Started:    PASSED`);
    console.log(`${verifyResult.code === 0 ? '✅' : '❌'} Endpoint Verification: ${verifyResult.code === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`${integrationResult.code === 0 ? '✅' : '❌'} Integration Test:      ${integrationResult.code === 0 ? 'PASSED' : 'FAILED'}`);
    console.log('═'.repeat(60));

    const allPassed = verifyResult.code === 0 && integrationResult.code === 0;

    if (allPassed) {
      console.log('\n🎉 ALL TESTS PASSED! Backend is fully functional and production-ready.\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed. Review the output above for details.\n');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up...');

    if (apiServer) {
      console.log('   Stopping API server...');
      apiServer.kill('SIGTERM');
      await wait(2000);
      if (!apiServer.killed) {
        apiServer.kill('SIGKILL');
      }
    }

    if (mongoServer) {
      console.log('   Stopping MongoDB...');
      await mongoServer.stop();
    }

    console.log('✅ Cleanup complete\n');
  }
};

runFullTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
