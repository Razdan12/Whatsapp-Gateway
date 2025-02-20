import { Router } from 'express';
import { createSession } from '../controllers/session.controller.js';
import { waAuthMiddleware } from '../middleware/waAuth.js';

const router = Router();

// Endpoint untuk membuat session WhatsApp; memakai API token auth
router.post('/create', waAuthMiddleware, createSession);

export default router;
