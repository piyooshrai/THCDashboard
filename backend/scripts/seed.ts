import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import User from '../src/models/User';
import Client from '../src/models/Client';
import VA from '../src/models/VA';
import TimeLog from '../src/models/TimeLog';
import Invoice from '../src/models/Invoice';
import Feedback from '../src/models/Feedback';
import logger from '../src/utils/logger';

dotenv.config();

const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    logger.info('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Client.deleteMany({});
    await VA.deleteMany({});
    await TimeLog.deleteMany({});
    await Invoice.deleteMany({});
    await Feedback.deleteMany({});

    // Create admin user
    logger.info('👤 Creating admin user...');
    const admin = await User.create({
      email: 'admin@thehc.com',
      password: 'Admin123!',
      role: 'admin',
      status: 'active'
    });

    // Create client users
    logger.info('👥 Creating client users...');
    const clientUser1 = await User.create({
      email: 'john@example.com',
      password: 'Client123!',
      role: 'client',
      status: 'active'
    });

    const clientUser2 = await User.create({
      email: 'jane@example.com',
      password: 'Client123!',
      role: 'client',
      status: 'active'
    });

    // Create client profiles
    logger.info('🏢 Creating client profiles...');
    const client1 = await Client.create({
      userId: clientUser1._id,
      name: 'John Smith',
      company: 'Smith Real Estate',
      industry: 'Real Estate',
      jobTitle: 'Real Estate Agent',
      locationState: 'California',
      calculatedHourlyValue: 52,
      dataSource: 'BLS_2024',
      confidenceLevel: 'high',
      baselineAdminHoursPerWeek: 15
    });

    const client2 = await Client.create({
      userId: clientUser2._id,
      name: 'Jane Doe',
      company: 'Doe Consulting',
      industry: 'Consulting',
      jobTitle: 'CEO',
      locationState: 'New York',
      companyRevenueRange: '$1M-$5M',
      calculatedHourlyValue: 100,
      dataSource: 'Kruze_Consulting_2025',
      confidenceLevel: 'high',
      baselineAdminHoursPerWeek: 20
    });

    // Create VA users
    logger.info('🎯 Creating VA users...');
    const vaUser1 = await User.create({
      email: 'maria@thehc.com',
      password: 'VA123!',
      role: 'va',
      status: 'active'
    });

    const vaUser2 = await User.create({
      email: 'david@thehc.com',
      password: 'VA123!',
      role: 'va',
      status: 'active'
    });

    // Create VA profiles
    const va1 = await VA.create({
      userId: vaUser1._id,
      name: 'Maria Garcia',
      department: 'Admin',
      hourlyRate: 60,
      specialization: 'Administrative Support'
    });

    const va2 = await VA.create({
      userId: vaUser2._id,
      name: 'David Chen',
      department: 'Marketing',
      hourlyRate: 65,
      specialization: 'Social Media Management'
    });

    // Create time logs
    logger.info('⏰ Creating time logs...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    await TimeLog.create({
      vaId: va1._id,
      clientId: client1._id,
      date: today,
      hoursWorked: 4,
      tasksCompleted: 8,
      taskCategory: 'Email Management',
      notes: 'Organized inbox, responded to inquiries'
    });

    await TimeLog.create({
      vaId: va1._id,
      clientId: client1._id,
      date: yesterday,
      hoursWorked: 5,
      tasksCompleted: 10,
      taskCategory: 'Calendar Management',
      notes: 'Scheduled meetings, updated calendar'
    });

    await TimeLog.create({
      vaId: va2._id,
      clientId: client2._id,
      date: today,
      hoursWorked: 3,
      tasksCompleted: 6,
      taskCategory: 'Social Media',
      notes: 'Created posts, engaged with followers'
    });

    await TimeLog.create({
      vaId: va2._id,
      clientId: client2._id,
      date: lastWeek,
      hoursWorked: 6,
      tasksCompleted: 12,
      taskCategory: 'Content Creation',
      notes: 'Designed graphics, wrote captions'
    });

    // Create invoices
    logger.info('💰 Creating invoices...');
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);

    await Invoice.create({
      clientId: client1._id,
      invoiceNumber: 'INV-202501-0001',
      lineItems: [
        {
          description: 'Administrative Support - January 2025',
          quantity: 9,
          rate: 60,
          amount: 540
        }
      ],
      amount: 540,
      currency: 'USD',
      dueDate,
      status: 'unpaid'
    });

    await Invoice.create({
      clientId: client2._id,
      invoiceNumber: 'INV-202501-0002',
      lineItems: [
        {
          description: 'Marketing Support - January 2025',
          quantity: 9,
          rate: 65,
          amount: 585
        }
      ],
      amount: 585,
      currency: 'USD',
      dueDate,
      status: 'paid',
      paidAt: today
    });

    // Create feedback
    logger.info('⭐ Creating feedback...');
    await Feedback.create({
      clientId: client1._id,
      vaId: va1._id,
      rating: 5,
      comment: 'Maria is excellent! Very organized and responsive.'
    });

    await Feedback.create({
      clientId: client2._id,
      vaId: va2._id,
      rating: 4,
      comment: 'David does great work on social media. Very creative!'
    });

    logger.info('✅ Database seeded successfully!');
    logger.info('\n📊 Summary:');
    logger.info(`   - Admin: admin@thehc.com / Admin123!`);
    logger.info(`   - Client 1: john@example.com / Client123!`);
    logger.info(`   - Client 2: jane@example.com / Client123!`);
    logger.info(`   - VA 1: maria@thehc.com / VA123!`);
    logger.info(`   - VA 2: david@thehc.com / VA123!`);
    logger.info(`   - ${await TimeLog.countDocuments()} time logs created`);
    logger.info(`   - ${await Invoice.countDocuments()} invoices created`);
    logger.info(`   - ${await Feedback.countDocuments()} feedback entries created`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedDatabase();
