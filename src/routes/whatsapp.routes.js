// src/routes/whatsapp.routes.js
import { Router } from 'express';
import { getStatus, sendMessage } from '../controllers/whatsapp.controller.js';
import { createSession } from '../controllers/session.controller.js';

const router = Router();

router.get('/', getStatus);
router.get('/send-message', sendMessage);
router.get('/create-session', createSession);

export default router;
