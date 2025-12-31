import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import AuditLog from '../models/AuditLog';

export const auditLog = (action: string, resourceType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await AuditLog.create({
        userId: req.userId,
        action,
        resourceType,
        resourceId: req.params.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        metadata: {
          body: req.body,
          params: req.params,
          query: req.query
        }
      });
    } catch (error) {
      // Log error but don't block request
      console.error('Audit log error:', error);
    }
    next();
  };
};
