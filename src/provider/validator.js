// src/provider/validator.js
import prism from '../config/prisma.db.js';
import { handleWebhook } from './webhooks.js'; 


const extractMessageContent = (msg) => {
  if (!msg.message) return null;
  // jika pesan ephemeral (type = 'ephemeralMessage')
  if (msg.message.ephemeralMessage) {
    return msg.message.ephemeralMessage.message;
  }
  return msg.message;
};

const getMessageType = (msg) => {
  const m = extractMessageContent(msg);
  if (!m) return 'unknown';

  if (m.conversation || m.extendedTextMessage)        return 'text';
  if (m.imageMessage)                                 return 'image';
  if (m.videoMessage)                                 return 'video';
  if (m.audioMessage)                                 return 'audio';
  if (m.documentMessage)                              return 'document';
  if (m.stickerMessage)                               return 'sticker';
  if (m.locationMessage)                              return 'location';
  if (m.contactMessage || m.contactsArray)            return 'contact';
  if (m.listResponseMessage)                          return 'list_response';
  if (m.buttonsResponseMessage)                       return 'button_response';
  if (m.templateButtonReplyMessage)                   return 'template_button';
  if (m.pollCreationMessage)                          return 'poll_creation';

  return 'unknown';
};

export const validatorWhatsapp = async (messageUpdate, whatsappAccountId) => {
  const messages = messageUpdate.messages || [];
  if (!messages.length) return;

  const whatsappAccount = await prism.session.findFirst({ 
    where: { id: whatsappAccountId }, 
    include: {
      user:    { include: { whitelist: true, blaclist: true } },
      webhook: true, 
    },
  });
  if (!whatsappAccount || !whatsappAccount.isActive || !whatsappAccount.user.isActive) return;

  for (const msg of messages) {
    if (msg.key.fromMe || msg.broadcast) continue;

    // Jenis chat: grup vs pribadi
    const remoteJid       = msg.key.remoteJid;
    const isGroup         = remoteJid.endsWith('@g.us');
    const isPrivate       = !isGroup;

    // Deteksi tipe pesan
    const type            = getMessageType(msg);

    // Flags tipe pesan
    const isText           = type === 'text';
    const isImage          = type === 'image';
    const isVideo          = type === 'video';
    const isAudio          = type === 'audio';
    const isDocument       = type === 'document';
    const isSticker        = type === 'sticker';
    const isLocation       = type === 'location';
    const isContact        = type === 'contact';
    const isListResponse   = type === 'list_response';
    const isButtonResponse = type === 'button_response';
    const isTemplateButton = type === 'template_button';
    const isPollCreation   = type === 'poll_creation';

    if (whatsappAccount.webhook?.length) {
      handleWebhook(msg, whatsappAccountId, {
        type,
        isGroup,
        isPrivate,
        isText,
        isImage,
        isVideo,
        isAudio,
        isDocument,
        isSticker,
        isLocation,
        isContact,
        isListResponse,
        isButtonResponse,
        isTemplateButton,
        isPollCreation
      });
    }
  }
};
