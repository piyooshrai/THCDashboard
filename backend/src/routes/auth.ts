import { Router } from 'express';
import { register, login, refreshToken, getProfile, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerValidator, loginValidator } from '../utils/validators';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh-token', refreshToken);
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
