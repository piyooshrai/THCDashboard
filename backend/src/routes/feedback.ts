import { Router } from 'express';
import {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getVAFeedbackStats
} from '../controllers/feedbackController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createFeedbackValidator, idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllFeedback);
router.get('/:id', idParamValidator, validate, getFeedbackById);
router.post('/', authorize('admin', 'client'), createFeedbackValidator, validate, createFeedback);
router.put('/:id', authorize('admin', 'client'), idParamValidator, validate, updateFeedback);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteFeedback);
router.get('/va/:vaId/stats', idParamValidator, validate, getVAFeedbackStats);

export default router;
