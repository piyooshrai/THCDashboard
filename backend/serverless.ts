import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database';
import { errorHandler } from './src/middleware/errorHandler';
import logger from './src/utils/logger';

// Import routes
import authRoutes from './src/routes/auth';
import userRoutes from './src/routes/users';
import clientRoutes from './src/routes/clients';
import vaRoutes from './src/routes/vas';
import timeLogRoutes from './src/routes/timeLogs';
import invoiceRoutes from './src/routes/invoices';
import reportRoutes from './src/routes/reports';
import documentRoutes from './src/routes/documents';
import feedbackRoutes from './src/routes/feedback';
import notificationRoutes from './src/routes/notifications';
import analyticsRoutes from './src/routes/analytics';

// Load environment variables
dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://thc-dashboard-khaki.vercel.app',
      'https://thc-dashboard.vercel.app'
    ];

    // Check if origin is in allowed list or ends with .vercel.app
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(null, true); // Allow all for now
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection promise for serverless reuse
let dbConnectionPromise: Promise<void> | null = null;

const ensureDbConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDatabase()
      .then(() => {
        logger.info('✅ Database connected for serverless function');
      })
      .catch((error) => {
        logger.error('❌ Database connection failed:', error);
        dbConnectionPromise = null; // Reset on failure
        throw error;
      });
  }
  return dbConnectionPromise;
};

// Middleware to ensure DB connection before processing API requests
app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    logger.error('Database connection error:', error);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint (doesn't need DB)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    mongodbConfigured: !!process.env.MONGODB_URI,
    mongodbUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET'
  });
});

// API Routes with v1 prefix to match frontend
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/vas', vaRoutes);
app.use('/api/v1/time-logs', timeLogRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'The Human Capital API',
    version: '1.0.0',
    status: 'running'
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

export default app;
