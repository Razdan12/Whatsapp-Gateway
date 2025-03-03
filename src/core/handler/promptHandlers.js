// promptHandlers.js
import { getWhatsappClient } from '../../utils/whatsappClient.js';
import { promptMapping } from '../../prompts/promptConfig.js';
import { handleIfast } from './ifastHandler.js';
import { loadPromptData } from '../../prompts/index.js'; 
const promptData = loadPromptData();

export const promptHandlers = {
 
  handleHelp: async (prompt, msg) => {
    const client = getWhatsappClient();
    const jid = msg.key.remoteJid;
    await client.sendMessage(jid, { text: promptData.general.help });
  },
 
  handleKenalan: async (prompt, msg) => {
    const client = getWhatsappClient();
    const jid = msg.key.remoteJid;
    await client.sendMessage(jid, { text: promptData.general.kenalan });
  },
 
  handleIfast: handleIfast
};

export const fallbackMessage = async (msg) => {
  const client = getWhatsappClient();
  const jid = msg.key.remoteJid;
  await client.sendMessage(jid, {
    text: promptData.fallback
  });
};

export const handlePromptCommand = async (prompt, msg) => {
  const lowerPrompt = prompt.toLowerCase();
  let handled = false;
  // Menggunakan promptMapping yang sudah diimpor secara statis di atas
  for (const [trigger, handlerName] of Object.entries(promptMapping)) {
    if (lowerPrompt.includes(trigger.toLowerCase())) {
      const handler = promptHandlers[handlerName];
      if (handler) {
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
