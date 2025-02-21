import express from 'express';
import { register, login, generateApiToken } from '../controllers/authController.js';
import { authenticateLoginToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route registrasi user baru
router.post('/register', register);

// Route login user
router.post('/login', login);

// Route untuk generate API token (hanya user yang sudah login)
router.get('/generate-token', authenticateLoginToken, generateApiToken);

export default router;
