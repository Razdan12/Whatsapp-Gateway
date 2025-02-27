// aggregatorWhatsapp.service.js
import prism from '../../config/prisma.db.js';
import { promptMapping } from './promptConfig.js';
import { handlePromptCommand, fallbackMessage } from '../handler/promptHandlers.js';

export const IncomingMessages = async (messageUpdate) => {
  const messages = messageUpdate.messages || [];
  if (messages.length === 0) return;

  // Ambil remoteJid dari pesan pertama untuk validasi pengguna
  const jid = messages[0].key.remoteJid;
  const phoneNumber = jid.split('@')[0];
  const user = await prism.user.findFirst({ where: { phoneWA: phoneNumber } });
  if (!user) return;

  for (const msg of messages) {
    // Proses pesan yang:
    // - Bukan dikirim oleh bot
    // - Bukan broadcast
    // - Bukan pesan dari grup
    if (!msg.key.fromMe && !msg.broadcast && !isGroupMessage(msg)) {
      const text = extractMessageText(msg);
      if (text) {
        if (containsTrigger(text)) {
          console.log('Trigger ditemukan, menjalankan prompt handling');
          await handlePromptCommand(text, msg);
        } else {
          console.log('Tidak ada trigger, mengirim fallback message');
          await fallbackMessage(msg);
        }
      }
    }
  }
};

const extractMessageText = (msg) => {
  if (msg.message?.conversation) {
    return msg.message.conversation;
  }
  if (msg.message?.extendedTextMessage?.text) {
    return msg.message.extendedTextMessage.text;
  }
  if (msg.message?.imageMessage?.caption) {
    return msg.message.imageMessage.caption;
  }
  return '';
};

const containsTrigger = (text) => {
  // Ambil daftar trigger dari promptMapping (menggunakan key-nya)
  const triggers = Object.keys(promptMapping);
  console.log('Daftar triggers:', triggers);
  return triggers.some((trigger) =>
    text.toLowerCase().includes(trigger.toLowerCase())
  );
};

const isGroupMessage = (msg) => {
  const jid = msg.key.remoteJid;
  return jid && jid.endsWith('@g.us');
};
