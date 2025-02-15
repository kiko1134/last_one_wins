import { Router } from 'express';
const router = Router();
import { createGame } from '../controllers/gameController.js';

router.post('/create', createGame);

export default router;
