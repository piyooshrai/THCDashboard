import { Router } from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  payInvoice,
  getInvoiceStats
} from '../controllers/invoiceController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createInvoiceValidator, idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllInvoices);
router.get('/stats', getInvoiceStats);
router.get('/:id', idParamValidator, validate, getInvoiceById);
router.post('/', authorize('admin'), createInvoiceValidator, validate, createInvoice);
router.put('/:id', authorize('admin'), idParamValidator, validate, updateInvoice);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteInvoice);
router.post('/:id/pay', authorize('admin', 'client'), idParamValidator, validate, payInvoice);

export default router;
