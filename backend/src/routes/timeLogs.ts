import { Router } from 'express';
import {
  getAllTimeLogs,
  getTimeLogById,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  getTimeLogSummary
} from '../controllers/timeLogController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createTimeLogValidator, idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllTimeLogs);
router.get('/summary', getTimeLogSummary);
router.get('/:id', idParamValidator, validate, getTimeLogById);
router.post('/', authorize('admin', 'va'), createTimeLogValidator, validate, createTimeLog);
router.put('/:id', authorize('admin', 'va'), idParamValidator, validate, updateTimeLog);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteTimeLog);

export default router;
