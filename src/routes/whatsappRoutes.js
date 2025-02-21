import express from 'express';
import { getChat, getChatByContact,  getQRCode, getWhatsappStatus, sendMedia, sendMessage } from '../controllers/whatsappController.js';
import { authenticateAPIToken } from '../middlewares/apiAuthMiddleware.js';

const router = express.Router();

router.get('/qr', authenticateAPIToken, getQRCode);
router.get('/send-message', authenticateAPIToken, sendMessage);
router.post('/send-media', authenticateAPIToken, sendMedia);
router.get('/chats', authenticateAPIToken, getChat);
router.get('/chat-by-contact', authenticateAPIToken, getChatByContact);
router.get('/status', authenticateAPIToken, getWhatsappStatus);

export default router;

