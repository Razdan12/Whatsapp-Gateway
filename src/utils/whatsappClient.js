import pkg, { DisconnectReason } from '@whiskeysockets/baileys';
const { default: makeWASocket, useMultiFileAuthState } = pkg;

let whatsappClient = null;
let whatsappQR = null;

export async function startWhatsApp(io) {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  whatsappClient = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  whatsappClient.ev.on('creds.update', saveCreds);

  whatsappClient.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      whatsappQR = qr;
      // Emit event "qr" ke semua client yang terkoneksi
      io.emit('qr', { qr });
    }
    if (connection === 'open') {
      console.log('WhatsApp connected');
      whatsappQR = null;
      // Emit event "whatsapp_connected"
      io.emit('whatsapp_connected', { message: 'WhatsApp connected' });
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('WhatsApp connection closed. Reconnecting:', shouldReconnect);
      // Emit event "whatsapp_disconnected"
      io.emit('whatsapp_disconnected', { message: 'WhatsApp disconnected' });
      if (shouldReconnect) {
        startWhatsApp(io);
      }
    }
  });

  whatsappClient.ev.on('messages.upsert', (m) => {
    console.log('New message:', JSON.stringify(m, null, 2));
  });
}

export function getWhatsappClient() {
  return whatsappClient;
}

export function getWhatsappQR() {
  return whatsappQR;
}
