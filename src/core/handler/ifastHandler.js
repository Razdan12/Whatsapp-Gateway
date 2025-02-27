// ifastHandler.js
import { getWhatsappClient } from '../../utils/whatsappClient.js';
import { ifastModule } from '../modul/ifast/ifastModule.js';

export const handleIfast = async (prompt, msg) => {
  const client = getWhatsappClient();
  const jid = msg.key.remoteJid;
  const lowerPrompt = prompt.toLowerCase();

  // Mapping sub-perintah Ifast ke fungsi handler dari ifastModule
  const ifastSubHandlers = {
    pengajuan: ifastModule.submit,
    rekap: ifastModule.recap,
    // Tambahkan mapping sub-perintah lainnya, misalnya:
    // update: ifastModule.update,
    // hapus: ifastModule.delete
  };

  let found = false;
  for (const [keyword, handler] of Object.entries(ifastSubHandlers)) {
    if (lowerPrompt.includes(keyword.toLowerCase())) {
      console.log(`Handling Ifast ${keyword} command`);
      await handler(prompt, msg);
      await client.sendMessage(jid, { text: `Perintah ${keyword} Ifast telah berhasil.` });
      found = true;
      break;
    }
  }
  if (!found) {
    await client.sendMessage(jid, { 
      text: `Modul Ifast: perintah tidak dikenali. Silakan periksa perintah Anda.` 
    });
  }
};
