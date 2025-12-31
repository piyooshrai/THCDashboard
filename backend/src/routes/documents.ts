import { Router } from 'express';
import {
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
  downloadDocument
} from '../controllers/documentController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { idParamValidator, paginationValidator } from '../utils/validators';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getAllDocuments);
router.get('/:id', idParamValidator, validate, getDocumentById);
router.post('/', upload.single('file'), uploadDocument);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteDocument);
router.get('/:id/download', idParamValidator, validate, downloadDocument);

export default router;
