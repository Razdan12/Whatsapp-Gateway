import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const saveChats = async (m) => {
   
    if (m.broadcast) {
     return
    }else{
        const message = m.messages[0];
        if (!message) return;
        console.log(message);
        const messageObj = message.message; // misal, message adalah objek pesan dari event upsert

if (
  messageObj?.extendedTextMessage &&
  messageObj.extendedTextMessage.contextInfo &&
  messageObj.extendedTextMessage.contextInfo.quotedMessage
) {
 
  const repliedMessage = messageObj.extendedTextMessage.contextInfo;
  console.log('Pesan yang dibalas:', repliedMessage);
} else {
  console.log('Pesan ini bukan balasan');
}
    
        const key = message.key;
        const remoteJid = key.remoteJid;
        // Untuk chat grup, key.participant biasanya ada
        const senderJid = key.participant || key.remoteJid;
    
        // Mengambil konten pesan dari beberapa kemungkinan properti
        let content = '';
        const msgContent = message.message || {};
    
        if (msgContent.conversation) {
          content = msgContent.conversation;
        } else if (msgContent.extendedTextMessage && msgContent.extendedTextMessage.text) {
          content = msgContent.extendedTextMessage.text;
        } else if (msgContent.imageMessage) {
          content = msgContent.imageMessage.caption || '';
        } else if (msgContent.videoMessage) {
          content = msgContent.videoMessage.caption || '';
        }
    
        // Menentukan tipe pesan berdasarkan properti yang tersedia
        let type = 'unknown';
        if (msgContent.imageMessage) {
          type = 'image';
        } else if (msgContent.videoMessage) {
          type = 'video';
        } else if (msgContent.conversation || (msgContent.extendedTextMessage && msgContent.extendedTextMessage.text)) {
          type = 'text';
        }
    
        const data = {
          jid: remoteJid,
          senderJid,
          content,
          type,
          fromMe : message.key.fromMe,
          pushName: message.pushName
        };
    
        return await prisma.message.create({ data });
    }
  };
  

  export async function getChats() {
    try {
      // Mengambil pesan dari database yang hanya memiliki fromMe false, diurutkan berdasarkan createdAt
      const data = await prisma.message.findMany({
        where: { fromMe: false },
        orderBy: { createdAt: 'asc' }
      });
      
      // Mengelompokkan pesan berdasarkan jid
      const groupedChats = data.reduce((groups, message) => {
        const jid = message.jid;
        if (!groups[jid]) {
          groups[jid] = [];
        }
        groups[jid].push(message);
        return groups;
      }, {});
      
      return groupedChats
    } catch (error) {
      return error
    }
  }
  