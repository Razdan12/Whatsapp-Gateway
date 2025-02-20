import prisma from '../config/prismaClient.js';
import { randomBytes } from 'crypto';

function generateRandomToken() {
  return randomBytes(32).toString('hex');
}

export async function generateApiToken(req, res) {
  try {
    // req.user di-set oleh jwtAuthMiddleware
    const userId = req.user.id;
    const token = generateRandomToken();
    const newApiToken = await prisma.apiToken.create({
      data: { token, userId }
    });
    res.json({ message: 'API token generated.', apiToken: newApiToken.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
