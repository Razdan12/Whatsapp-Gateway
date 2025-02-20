import prisma from '../config/prismaClient.js';

export async function waAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'API token missing or invalid. Use Bearer <token>.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const apiToken = await prisma.apiToken.findUnique({
      where: { token },
      include: { user: true }
    });
    if (!apiToken) {
      return res.status(401).json({ error: 'API token invalid.' });
    }
    req.apiToken = apiToken; // contains user info as well
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
