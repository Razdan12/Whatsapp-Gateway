import { getWhatsappClient, getWhatsappQR } from '../utils/whatsappClient.js';

export async function getQRCode(req, res) {
  const qr = getWhatsappQR();
  if (qr) {
    res.json({ qr });
  } else {
    res.status(404).json({ error: "QR code tidak tersedia" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { number, message } = req.query;
    if (!number || !message) {
      return res.status(400).send('Parameter "number" dan "message" harus disertakan.');
    }
    // Format nomor WhatsApp, misalnya '6281234567890@s.whatsapp.net'
    const jid = `${number}@s.whatsapp.net`;
    const client = getWhatsappClient();
    if (!client) {
      return res.status(500).json({ error: "WhatsApp client belum siap" });
    }
    const result = await client.sendMessage(jid, { text: message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
