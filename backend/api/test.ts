import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    message: 'Minimal test endpoint working',
    timestamp: new Date().toISOString(),
    env: {
      nodeVersion: process.version,
      vercel: process.env.VERCEL,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
}
