import app from '../src/server';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Export the Express app as a serverless function
export default app;
