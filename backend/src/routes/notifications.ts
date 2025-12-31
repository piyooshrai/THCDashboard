import { Router } from 'express';
import {
  getMyNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead
} from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { idParamValidator, paginationValidator } from '../utils/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paginationValidator, validate, getMyNotifications);
router.get('/:id', idParamValidator, validate, getNotificationById);
router.post('/', authorize('admin'), createNotification);
router.patch('/:id/read', idParamValidator, validate, markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', idParamValidator, validate, deleteNotification);
router.delete('/read-all', deleteAllRead);

export default router;
