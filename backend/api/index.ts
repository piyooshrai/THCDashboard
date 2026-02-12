import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple test handler to verify deployment works
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple routing
  const path = req.url || '/';

  if (path === '/health' || path === '/api/health') {
    return res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  }

  if (path === '/test' || path === '/api/test') {
    return res.status(200).json({
      message: 'Test endpoint working!',
      method: req.method,
      path: path,
      timestamp: new Date().toISOString()
    });
  }

  // Default response
  return res.status(200).json({
    message: 'THC Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test'
    }
  });
}
