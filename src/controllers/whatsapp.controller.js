// src/controllers/whatsapp.controller.js
export function getStatus(req, res) {
  // Ambil sessionId dari query, default ke 'device1'
  const sessionId = req.query.sessionId || 'device1';
  if (globalThis.latestQrs && globalThis.latestQrs[sessionId]) {
    res.json({ sessionId, qr: globalThis.latestQrs[sessionId] });
  } else {
    res.json({ message: `QR code for session ${sessionId} not available, please wait.` });
  }
}

export async function sendMessage(req, res) {
  try {
    const sessionId = req.query.sessionId || 'device1';
    const client = globalThis.whatsappClients ? globalThis.whatsappClients[sessionId] : null;
    if (!client) {
      res.status(400).send('Session not found.');
      return;
    }
    const number = req.query.number;
    const message = req.query.message;
    if (!number || !message) {
      res.status(400).send('Parameters "number" and "message" are required.');
      return;
    }
    const jid = `${number}@s.whatsapp.net`;
    const result = await client.sendMessage(jid, { text: message });
    res.send(result);
  } catch (error) {
    res.status(500).send(error.toString());
  }
}
