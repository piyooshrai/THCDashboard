import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientROI,
  recalculateHourlyValue
} from '../controllers/clientController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createClientValidator, idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllClients);
router.get('/:id', idParamValidator, validate, getClientById);
router.post('/', authorize('admin'), createClientValidator, validate, createClient);
router.put('/:id', authorize('admin', 'client'), idParamValidator, validate, updateClient);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteClient);
router.get('/:id/roi', idParamValidator, validate, getClientROI);
router.post('/:id/recalculate-hourly-value', authorize('admin'), idParamValidator, validate, recalculateHourlyValue);

export default router;
