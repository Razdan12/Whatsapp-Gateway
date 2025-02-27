// promptHandlers.js
import { getWhatsappClient } from '../../utils/whatsappClient.js';
import { promptMapping } from '../agregator/promptConfig.js';
import { handleIfast } from './ifastHandler.js';

export const promptHandlers = {
  handlePrompt: async (prompt, msg) => {
    const client = getWhatsappClient();
    const jid = msg.key.remoteJid;
    await client.sendMessage(jid, { text: `Anda memicu command PROMPT dengan: ${prompt}` });
  },
  handleHelp: async (prompt, msg) => {
    const client = getWhatsappClient();
    const jid = msg.key.remoteJid;
    await client.sendMessage(jid, { text: `Ini adalah bantuan. Silakan gunakan command yang tepat.` });
  },
  handleExecute: async (prompt, msg) => {
    const client = getWhatsappClient();
    const jid = msg.key.remoteJid;
    await client.sendMessage(jid, { text: `Anda menjalankan perintah EXECUTE. Memproses...` });
  },
  handleCommand: async (prompt, msg) => {
    const client = getWhatsappClient();
    const jid = msg.key.remoteJid;
    await client.sendMessage(jid, { text: `Anda memicu COMMAND.` });
  },
  // Handler Ifast sudah diimpor dari file ifastHandler.js
  handleIfast: handleIfast
};

export const fallbackMessage = async (msg) => {
  const client = getWhatsappClient();
  const jid = msg.key.remoteJid;
  await client.sendMessage(jid, {
    text: 'saya tidak mengerti apa maksud anda, bisa di detailkan lagi perintahnya? atau gunakan perintah *Help* untuk bantuan'
  });
  console.log('Fallback response sent');
};

export const handlePromptCommand = async (prompt, msg) => {
  const lowerPrompt = prompt.toLowerCase();
  let handled = false;
  // Menggunakan promptMapping yang sudah diimpor secara statis di atas
  for (const [trigger, handlerName] of Object.entries(promptMapping)) {
    if (lowerPrompt.includes(trigger.toLowerCase())) {
      const handler = promptHandlers[handlerName];
      if (handler) {
        console.log(`Executing handler for trigger: ${trigger}`);
        await handler(prompt, msg);
        handled = true;
        break;
      }
    }
  }
  if (!handled) {
    await fallbackMessage(msg);
  }
};
