import { Router } from 'express';
import {
  getDashboardAnalytics,
  getRevenueByMonth,
  getTopPerformingVAs,
  getClientAnalytics,
  getVAAnalytics
} from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { idParamValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', authorize('admin'), getDashboardAnalytics);
router.get('/revenue-by-month', authorize('admin'), getRevenueByMonth);
router.get('/top-vas', authorize('admin'), getTopPerformingVAs);
router.get('/client/:clientId', idParamValidator, validate, getClientAnalytics);
router.get('/va/:vaId', idParamValidator, validate, getVAAnalytics);

export default router;
