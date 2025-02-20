// src/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import whatsappRoutes from './routes/whatsapp.routes.js';
import { createWhatsAppClient } from './services/whatsapp.service.js';

const app = express();
const port = process.env.PORT || 3000;

// Buat server HTTP dan Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Simpan instance Socket.IO secara global
globalThis.io = io;
globalThis.whatsappClients = {};
globalThis.latestQrs = {};

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  
  // Kirim QR code default untuk session "device1" jika tersedia
  if (globalThis.latestQrs['device1']) {
    socket.emit('qr-update', { sessionId: 'device1', qr: globalThis.latestQrs['device1'] });
  }
  
  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

async function initSession(sessionId) {
  const client = await createWhatsAppClient(sessionId);
  globalThis.whatsappClients[sessionId] = client;
  console.log(`Client for session ${sessionId} initialized.`);
}

async function main() {
  // Inisialisasi session default (misalnya 'device1')
  await initSession('device1');

  app.use('/', whatsappRoutes);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch(console.error);
