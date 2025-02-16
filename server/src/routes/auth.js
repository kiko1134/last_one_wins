import { Router } from 'express';
const router = Router();
import { register, login } from '../controllers/authController.js';
import {fileURLToPath} from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Това е тестов път за регистрация на потребителя
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/src/testUser.html'));
});

router.post('/register', register);
router.post('/login', login);

export default router;
