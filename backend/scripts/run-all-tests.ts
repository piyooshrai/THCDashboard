import { MongoMemoryServer } from 'mongodb-memory-server';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const runCommand = (command: string, description: string): boolean => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`▶️  ${description}`);
  console.log('='.repeat(60));

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: __dirname + '/..',
      env: { ...process.env }
    });
    return true;
  } catch (error) {
    console.error(`\n❌ ${description} failed`);
    return false;
  }
};

const runAllTests = async () => {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║       Complete Backend Test Suite with Local MongoDB    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  let mongoServer: MongoMemoryServer | null = null;

  try {
    // Start in-memory MongoDB
    console.log('🚀 Starting in-memory MongoDB server...');
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'thehuman_capital_test'
      }
    });

    const mongoUri = mongoServer.getUri();
    console.log(`✅ In-memory MongoDB started`);
    console.log(`   URI: ${mongoUri}`);

    // Override MONGODB_URI for tests
    process.env.MONGODB_URI = mongoUri;

    // Run all test phases
    const results = {
      check: false,
      seed: false,
      verify: false,
      integration: false
    };

    // Phase 1: Setup Check
    results.check = runCommand(
      `MONGODB_URI="${mongoUri}" ts-node scripts/check-setup.ts`,
      'Phase 1: Setup Verification'
    );

    if (!results.check) {
      throw new Error('Setup verification failed');
    }

    // Phase 2: Database Seed
    results.seed = runCommand(
      `MONGODB_URI="${mongoUri}" ts-node scripts/seed.ts`,
      'Phase 2: Database Seeding'
    );

    if (!results.seed) {
      throw new Error('Database seeding failed');
    }

    // Phase 3: Endpoint Verification
    results.verify = runCommand(
      `MONGODB_URI="${mongoUri}" BASE_URL=http://localhost:5000/api/v1 ts-node scripts/verify.ts`,
      'Phase 3: Endpoint Verification (50+ endpoints)'
    );

    // Phase 4: Integration Test
    results.integration = runCommand(
      `MONGODB_URI="${mongoUri}" BASE_URL=http://localhost:5000/api/v1 ts-node scripts/integration-test.ts`,
      'Phase 4: Integration Test'
    );

    // Final Summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 TEST SUITE SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Setup Verification:    ${results.check ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Database Seeding:      ${results.seed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Endpoint Verification: ${results.verify ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Integration Test:      ${results.integration ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('═'.repeat(60));

    const allPassed = Object.values(results).every(r => r === true);

    if (allPassed) {
      console.log('\n🎉 ALL TESTS PASSED! Backend is fully functional.\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed. Review the output above.\n');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup: Stop MongoDB
    if (mongoServer) {
      console.log('\n🛑 Stopping in-memory MongoDB...');
      await mongoServer.stop();
      console.log('✅ Cleanup complete\n');
    }
  }
};

runAllTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
