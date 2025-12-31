import { Router } from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  deleteReport,
  downloadReport
} from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createReportValidator, idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllReports);
router.get('/:id', idParamValidator, validate, getReportById);
router.post('/', authorize('admin'), createReportValidator, validate, createReport);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteReport);
router.get('/:id/download', idParamValidator, validate, downloadReport);

export default router;
