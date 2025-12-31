import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', authorize('admin'), paginationValidator, validate, getAllUsers);
router.get('/:id', authorize('admin'), idParamValidator, validate, getUserById);
router.put('/:id', authorize('admin'), idParamValidator, validate, updateUser);
router.delete('/:id', authorize('admin'), idParamValidator, validate, deleteUser);
router.patch('/:id/toggle-status', authorize('admin'), idParamValidator, validate, toggleUserStatus);

export default router;
