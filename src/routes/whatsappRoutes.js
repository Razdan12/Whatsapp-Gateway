import express from 'express';
import { getQRCode, sendMessage } from '../controllers/whatsappController.js';
import { authenticateAPIToken } from '../middlewares/apiAuthMiddleware.js';

const router = express.Router();

router.get('/qr', authenticateAPIToken, getQRCode);
router.get('/send-message', authenticateAPIToken, sendMessage);

export default router;

