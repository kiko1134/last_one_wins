import { Router } from 'express';
import { register, login, logout, checkAuth } from '../controllers/authController.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/checkAuth', checkAuth);

export default router;
