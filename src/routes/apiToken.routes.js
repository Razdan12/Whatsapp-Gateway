import { Router } from 'express';
import { generateApiToken } from '../controllers/apiToken.controller.js';
import { jwtAuthMiddleware } from '../middleware/jwtAuth.js';

const router = Router();

// Endpoint untuk generate API token; user harus login (JWT valid)
router.post('/generate-api-token', jwtAuthMiddleware, generateApiToken);

export default router;
