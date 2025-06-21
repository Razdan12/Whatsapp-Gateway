// validator.js (Modifikasi)
import prism from '../config/prisma.db.js';
import { handleWebhook } from './webhooks.js'; 

export const validatorWhatsapp = async (messageUpdate, whatsappAccountId) => {
  const messages = messageUpdate.messages || [];

  if (messages.length === 0) return;

  const jid = messages[0].key.remoteJid;
  const phoneNumber = jid.split('@')[0];

  const whatsappAccount = await prism.session.findFirst({ 
    where: { id: whatsappAccountId }, 
    include: {
      user: { 
        include: { whitelist: true, blaclist: true }
      },
      webhook: true, 
    },
  });

  if (!whatsappAccount) return
  if (!whatsappAccount.isActive) return
  if (!whatsappAccount.user.isActive) return
  if (whatsappAccount.user.whitelist.length > 0) {
    const isWhitelisted = whatsappAccount.user.whitelist.some(item => item.noWhatsapp === phoneNumber); 
    if (!isWhitelisted) return
  }
  if (whatsappAccount.user.blaclist.length > 0) {
    const isBlacklisted = whatsappAccount.user.blaclist.some(item => item.noWhatsapp === phoneNumber); 
    if (isBlacklisted) return
  }

  for (const msg of messages) {
    if (!msg.key.fromMe && !msg.broadcast) {
     if (whatsappAccount.webhook && whatsappAccount.webhook.length > 0) {
        handleWebhook(msg, whatsappAccountId); 
      }
    }
  }
};

// Fungsi helper lainnya (extractMessageText, isGroupMessage) tetap sama
const extractMessageText = (msg) => { /* ... */ };
const isGroupMessage = (msg) => { /* ... */ };