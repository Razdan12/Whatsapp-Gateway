import { Router } from 'express';
import { getStatus, sendMessage } from '../controllers/whatsapp.controller.js';
import { waAuthMiddleware } from '../middleware/waAuth.js';

const router = Router();

router.get('/', waAuthMiddleware, getStatus);
router.get('/send-message', waAuthMiddleware, sendMessage);

export default router;
