import { Router } from 'express';
const router = Router();
import { createGame } from '../controllers/gameController.js';
import { authenticateSession } from '../middleware/auth.js';

router.post('/create', authenticateSession, createGame);

export default router;
