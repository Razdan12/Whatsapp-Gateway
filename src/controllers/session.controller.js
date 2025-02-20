export async function createSession(req, res) {
    const sessionId = req.query.sessionId;
    if (!sessionId) {
      res.status(400).send('Parameter sessionId is required.');
      return;
    }
    if (globalThis.whatsappClients && globalThis.whatsappClients[sessionId]) {
      res.status(400).send('Session already exists.');
      return;
    }
    try {
      const { createWhatsAppClient } = await import('../services/whatsapp.service.js');
      const client = await createWhatsAppClient(sessionId);
      if (!globalThis.whatsappClients) globalThis.whatsappClients = {};
      globalThis.whatsappClients[sessionId] = client;
      res.json({ message: `Session ${sessionId} created successfully.` });
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }
  