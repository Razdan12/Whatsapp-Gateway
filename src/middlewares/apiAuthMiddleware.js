import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function authenticateAPIToken(req, res, next) {
  const apiToken = req.headers['x-api-key'];
  if (!apiToken) {
    return res.status(401).json({ error: "API token diperlukan" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { apiToken }
    });
    if (!user) {
      return res.status(401).json({ error: "API token tidak valid" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
