export async function createSession(req, res) {
    try {
      // Mengambil userId dari token API (dari waAuth middleware)
      const userId = req.apiToken.user.id;
      const sessionId = String(userId);
      if (globalThis.whatsappClients[sessionId]) {
        return res.status(400).json({ error: `Session already exists for user ${userId}` });
      }
      const { createWhatsAppClient } = await import('../services/whatsapp.service.js');
      const client = await createWhatsAppClient(sessionId);
      globalThis.whatsappClients[sessionId] = client;
      res.json({ message: `Session created for user ${userId}.` });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
  