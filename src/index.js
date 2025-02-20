import express from 'express';
import pkg from '@whiskeysockets/baileys';

const { default: makeWASocket, useMultiFileAuthState } = pkg;

const app = express();
const port = process.env.PORT || 3000;

// Fungsi untuk memulai client WhatsApp
async function startWhatsApp() {
  // Menggunakan direktori 'auth_info' untuk menyimpan kredensial
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

  const client = makeWASocket({
    auth: state,
    printQRInTerminal: true // QR code akan muncul di terminal untuk autentikasi
  });

  // Simpan kredensial saat terjadi pembaruan
  client.ev.on('creds.update', saveCreds);

  // Contoh: Menampilkan pesan yang diterima
  client.ev.on('messages.upsert', (m) => {
    console.log('Pesan baru:', JSON.stringify(m, null, 2));
  });

  return client;
}

let whatsappClient;
startWhatsApp().then(client => {
  whatsappClient = client;
});

// Endpoint dasar untuk mengecek server
app.get('/', (req, res) => {
  res.send('Server Express dengan Baileys sudah berjalan!');
});

// Endpoint untuk mengirim pesan WhatsApp
// Contoh: /send-message?number=6281234567890&message=Halo
app.get('/send-message', async (req, res) => {
  try {
    const { number, message } = req.query;
    if (!number || !message) {
      return res.status(400).send('Parameter "number" dan "message" harus disertakan.');
    }
    // Format nomor WhatsApp: misalnya '6281234567890@s.whatsapp.net'
    const jid = `${number}@s.whatsapp.net`;
    const result = await whatsappClient.sendMessage(jid, { text: message });
    res.send(result);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
