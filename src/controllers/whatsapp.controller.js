export function getStatus(req, res) {
  const userId = req.apiToken.user.id;
  const sessionId = String(userId);
  if (globalThis.latestQrs && globalThis.latestQrs[sessionId]) {
    res.json({ sessionId, qr: globalThis.latestQrs[sessionId] });
  } else {
    res.json({ message: `QR code for session ${sessionId} not available. Create session first.` });
  }
}

export async function sendMessage(req, res) {
  try {
    const userId = req.apiToken.user.id;
    const sessionId = String(userId);
    const client = globalThis.whatsappClients[sessionId];
    if (!client) {
      return res.status(400).json({ error: `No session found for user ${userId}. Please create session first.` });
    }
    const { number, message } = req.query;
    if (!number || !message) {
      return res.status(400).json({ error: 'Parameters "number" and "message" are required.' });
    }
    const jid = `${number}@s.whatsapp.net`;
    const result = await client.sendMessage(jid, { text: message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
