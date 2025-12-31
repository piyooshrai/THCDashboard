import { Router } from 'express';
import {
  getAllVAs,
  getVAById,
  createVA,
  updateVA,
  deleteVA,
  getVAPerformance
} from '../controllers/vaController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createVAValidator, idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllVAs);
router.get('/:id', idParamValidator, validate, getVAById);
router.post('/', authorize('admin'), createVAValidator, validate, createVA);
router.put('/:id', authorize('admin', 'va'), idParamValidator, validate, updateVA);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteVA);
router.get('/:id/performance', idParamValidator, validate, getVAPerformance);

export default router;
