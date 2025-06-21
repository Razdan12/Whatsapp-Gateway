import prism from '../config/prisma.db.js';
import { startWhatsApp } from '../utils/whatsappClient.js';

export const startAllService = async (io) => {
  const session = await prism.session.findMany({ where: { status: true , isActive: true} });

  for (const sesi of session) {
    try {
      await startWhatsApp(io, sesi.id);
      console.log(`✅ WhatsApp session started: ${sesi.name}`);
    } catch (err) {
      console.error(`❌ Failed to start WhatsApp session ${sesi.id}:`, err);
    }
  }
};
