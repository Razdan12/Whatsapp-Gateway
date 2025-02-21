import pkg, { DisconnectReason, makeInMemoryStore } from '@whiskeysockets/baileys';
import pino from 'pino';
import { saveChats } from '../services/whatsapp.service.js';
const { default: makeWASocket, useMultiFileAuthState } = pkg;

// Inisialisasi store in-memory
export const store = makeInMemoryStore({ logger: pino({ level: 'silent' }) });
  
let whatsappClient = null;
let whatsappQR = null;

export async function startWhatsApp(io) {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  whatsappClient = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  // Bind store ke event client
  store.bind(whatsappClient.ev);

  whatsappClient.ev.on('creds.update', saveCreds);

  whatsappClient.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      whatsappQR = qr;
      io.emit('qr', { qr });
    }
    if (connection === 'open') {
      whatsappQR = 'connect';
      io.emit('whatsapp_connected', { message: 'WhatsApp connected' });
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      whatsappQR = 'disconect';
      io.emit('whatsapp_disconnected', { message: 'WhatsApp disconnected' });
      if (shouldReconnect) {
        startWhatsApp(io);
      }
    }
  });

  whatsappClient.ev.on('messages.upsert', (m) => {
    saveChats(m)
    io.emit('chat', { message: 'new chat' });
   
  });
}

export function getWhatsappClient() {
  return whatsappClient;
}

export function getWhatsappQR() {
  return whatsappQR;
}
