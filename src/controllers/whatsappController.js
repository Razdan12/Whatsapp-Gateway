
import { getChats } from '../services/whatsapp.service.js';
import { getWhatsappClient, getWhatsappQR } from '../utils/whatsappClient.js';

export async function getQRCode(req, res) {
  const qr = getWhatsappQR();
  console.log(qr);
  
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

export async function sendMedia(req, res) {
    try {
      const { number, mediaUrl, type, caption } = req.body;
      if (!number || !mediaUrl || !type) {
        return res.status(400).json({ error: 'Parameter "number", "mediaUrl", dan "type" harus disertakan.' });
      }
      // Format nomor WhatsApp: misalnya '6281234567890@s.whatsapp.net'
      const jid = `${number}@s.whatsapp.net`;
      const client = getWhatsappClient();
      if (!client) {
        return res.status(500).json({ error: "WhatsApp client belum siap" });
      }
  
      let messageData = {};
      if (type === 'image') {
        messageData = { image: { url: mediaUrl }, caption: caption || '' };
      } else if (type === 'video') {
        messageData = { video: { url: mediaUrl }, caption: caption || '' };
      } else if (type === 'document') {
        // Misalnya untuk dokumen PDF, sesuaikan mimetype jika perlu
        messageData = { document: { url: mediaUrl }, mimetype: 'application/pdf', caption: caption || '' };
      } else if (type === 'audio') {
        messageData = { audio: { url: mediaUrl } };
      } else {
        return res.status(400).json({ error: "Tipe media tidak dikenali" });
      }
  
      const result = await client.sendMessage(jid, messageData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }

export async function getChat(req, res) {
  try {
    // Mengubah object chats menjadi array
    const chats = await getChats()
    res.json({ chats });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getChatByContact(req, res) {
    try {
      const { contact, isGroup } = req.query;
      if (!contact) {
        return res.status(400).json({ error: 'Parameter "contact" diperlukan.' });
      }
      // Jika isGroup bernilai 'true', gunakan format JID untuk grup (@g.us), 
      // jika tidak, gunakan format JID untuk kontak (@s.whatsapp.net)
      let jid = isGroup === 'true' ? `${contact}@g.us` : `${contact}@s.whatsapp.net`;
      
      const chat = store.chats.get(jid);
      if (!chat) {
        return res.status(404).json({ error: 'Chat tidak ditemukan untuk kontak atau grup tersebut.' });
      }
      res.json({ chat });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }

  export async function getWhatsappStatus(req, res) {
    try {
      const client = getWhatsappClient();
      // Misalnya kita anggap client yang terdefinisi dan qr status "connect" berarti terhubung
      if (client && getWhatsappQR() === 'connect') {
        return res.json({ connected: true, message: 'connect' });
      }
      return res.json({ connected: false, message: 'disconect' });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }