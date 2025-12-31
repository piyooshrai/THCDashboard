import { Request } from 'express';

export function getPaginationParams(req: Request): { page: number; limit: number; skip: number } {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return `INV-${year}${month}-${random}`;
}

export function calculateDateRange(type: 'weekly' | 'monthly' | 'custom', customStart?: Date, customEnd?: Date): { start: Date; end: Date } {
  const now = new Date();
  let start: Date;
  let end: Date = now;

  if (type === 'custom' && customStart && customEnd) {
    start = new Date(customStart);
    end = new Date(customEnd);
  } else if (type === 'weekly') {
    start = new Date(now);
    start.setDate(now.getDate() - 7);
  } else if (type === 'monthly') {
    start = new Date(now);
    start.setMonth(now.getMonth() - 1);
  } else {
    start = new Date(now);
    start.setDate(now.getDate() - 30);
  }

  return { start, end };
}

export function sanitizeUser(user: any): any {
  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  return sanitized;
}

export function getClientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
         req.socket.remoteAddress ||
         'unknown';
}
