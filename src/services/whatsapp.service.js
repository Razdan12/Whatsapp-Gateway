// src/services/whatsapp.service.js
import { makeWASocket } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import { loadAuthState, saveAuthState } from './prismaSession.service.js';

export async function createWhatsAppClient(sessionId) {
  const state = await loadAuthState(sessionId);

  const client = makeWASocket({
    auth: state,
    printQRInTerminal: false, // Tidak tampilkan QR di terminal
  });

  // Simpan kredensial saat ada update
  client.ev.on('creds.update', async () => {
    await saveAuthState(sessionId, state);
  });

  // Tangani event connection.update untuk mendapatkan QR code
  client.ev.on('connection.update', async (update) => {
    if (update.qr) {
      try {
        const qrDataUrl = await QRCode.toDataURL(update.qr);
        globalThis.latestQrs[sessionId] = qrDataUrl;
        console.log(`QR Code updated for session ${sessionId}.`);
        // Emit event ke semua klien yang terhubung melalui Socket.IO
        if (globalThis.io) {
          globalThis.io.emit('qr-update', { sessionId, qr: qrDataUrl });
        }
      } catch (err) {
        console.error('Failed to generate QR code:', err);
        globalThis.latestQrs[sessionId] = update.qr;
        if (globalThis.io) {
          globalThis.io.emit('qr-update', { sessionId, qr: update.qr });
        }
      }
    }
  });

  // Contoh listener untuk pesan masuk
  client.ev.on('messages.upsert', (m) => {
    console.log('New message:', JSON.stringify(m, null, 2));
  });

  return client;
}
