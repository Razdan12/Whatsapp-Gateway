// aggregatorWhatsapp.service.js
import prism from '../../config/prisma.db.js';
import { promptMapping } from '../../prompts/promptConfig.js';
import { handlePromptCommand, fallbackMessage } from '../handler/promptHandlers.js';
import { getWhatsappClient } from '../../utils/whatsappClient.js';

export const IncomingMessages = async (messageUpdate) => {
  const messages = messageUpdate.messages || [];
  if (messages.length === 0) return;

  // Ambil remoteJid dari pesan pertama untuk validasi pengguna
  const jid = messages[0].key.remoteJid;
  const phoneNumber = jid.split('@')[0];
  const user = await prism.listUser.findUnique({ where: { whatsapp: phoneNumber } });
  if (!user) return;
  

  for (const msg of messages) {
    if (!msg.key.fromMe && !msg.broadcast && !isGroupMessage(msg)) {
      if (user.blackList){
        const client = getWhatsappClient();
        await client.sendMessage(jid, { text: `halo ${user.name}, maaf ya kamu tidak diperbolehkan lagi untuk chat dengan MIRA` });
        return
      }
      const text = extractMessageText(msg);
      if (text) {
        if (containsTrigger(text)) {
          await handlePromptCommand(text, msg);
        } else {
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
  return triggers.some((trigger) =>
    text.toLowerCase().includes(trigger.toLowerCase())
  );
};

const isGroupMessage = (msg) => {
  const jid = msg.key.remoteJid;
  return jid && jid.endsWith('@g.us');
};
