import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({
        error: 'Access forbidden',
        message: 'You do not have permission to perform this action'
      });
      return;
    }

    next();
  };
};
