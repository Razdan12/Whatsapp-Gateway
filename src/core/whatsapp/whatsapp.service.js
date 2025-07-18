import BaseService from '../../base/service.base.js';
import { formatPhoneNumber } from '../../helpers/phoneNumber.js';
import {
  getQr,
  startWhatsApp,
} from '../../utils/whatsappClient.js';
import prism from '../../config/prisma.db.js';
import fs from 'fs';

class WhatsappService extends BaseService {
  constructor() {
    super(prism);
  }

  getQRAuth = async (sessionId) => {
    const qr = getQr(sessionId);
    return qr;
  };

  startWhatsappClient = async (io, sessionId) => {
    const server = await startWhatsApp(io, sessionId);
    return server;
  }

  sendMessage = async (payload) => {
    const { number, message, type } = payload;
    const phone = formatPhoneNumber(number);
    const jid = `${phone}@s.whatsapp.net`;
    const client = getWhatsappClient();
    return client.sendMessage(jid, { text: message });
  };

  // sendMedia = async (payload) => {
  
  //   const { number, filePath, type, caption } = payload;
  //   if (!filePath) {
  //     throw new Error('File media tidak ditemukan. Pastikan file telah diupload dengan benar.');
  //   }
  
  //   const phone = formatPhoneNumber(number);
  //   const jid = `${phone}@s.whatsapp.net`;
  //   const client = getWhatsappClient();
  
  //   let mediaBuffer;
  //   try {
  //     mediaBuffer = fs.readFileSync(filePath);
  //   } catch (error) {
  //     throw new Error('Gagal membaca file media: ' + error.message);
  //   }
  
  //   let messageContent = {};
  
  //   if (type === 'image') {
  //     messageContent = { image: mediaBuffer, caption: caption || '' };
  //   } else if (type === 'video') {
  //     messageContent = { video: mediaBuffer, caption: caption || '' };
  //   } else if (type === 'document') {
  //     messageContent = {
  //       document: mediaBuffer,
  //       mimetype: 'application/pdf',
  //       caption: caption || '',
  //       fileName: 'document.pdf'
  //     };
  //   } else if (type === 'audio') {
  //     messageContent = { audio: mediaBuffer };
  //   } else {
  //     throw new Error('Tipe media tidak dikenali');
  //   }
  
  //   return await client.sendMessage(jid, messageContent);
  // };
  
}

export default WhatsappService;
