// import pkg from 'baileys';
// import pino from 'pino';
// import fs from 'fs/promises';
// import { validatorWhatsapp } from '../provider/validator.js';
// import prisma from '../config/prisma.db.js';

// const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// const clients = new Map(); // sessionId → socket instance
// const qrs = new Map(); // sessionId → latest QR code

// export const startWhatsApp = async (io, sessionId) => {
//   // 1) Jika sudah ada client untuk sessionId ini
//   if (clients.has(sessionId)) {
//     console.log(`Session ${sessionId} already running`);
//     // Emit event khusus ke room sessionId
//     io.to(sessionId).emit('session_status', {
//       sessionId,
//       connected: true,
//       already:   true
//     });
//     return;
//   }

//   try {
//     const { state, saveCreds: origSaveCreds } = await useMultiFileAuthState(
//       `./auth_info/${sessionId}`
//     );

//     const saveCreds = async (...args) => {
//       try { await origSaveCreds(...args) } catch { /* ignore */ }
//     };

//     const sock = makeWASocket({
//       auth:                 state,
//       printQRInTerminal:    false,
//       syncFullHistory:      false,
//       defaultQueryTimeoutMs: undefined,
//       logger:               pino({ level: 'silent' }),
//     });

//     clients.set(sessionId, sock);
//     sock.ev.on('creds.update', saveCreds);

//     sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
//       if (qr) {
//         qrs.set(sessionId, qr);
//         io.to(sessionId).emit('qr', { sessionId, qr });
//       }
//       if (connection === 'open') {
//         io.to(sessionId).emit('connected', { sessionId });
//         await prisma.session.update({
//           where: { id: sessionId },
//           data: { status: true }
//         });
//       }
//       if (connection === 'close') {
//         const code      = lastDisconnect?.error?.output?.statusCode;
//         const msg       = lastDisconnect?.error?.message || '';
//         const isLoggedOut = code === DisconnectReason.loggedOut;
       
//         sock.ev.removeAllListeners();
//         try { await sock.end() } catch {}

//         clients.delete(sessionId);
//         qrs.delete(sessionId);

//         if (isLoggedOut) {
//           // benar-benar logout → hapus creds
//           await fs.rm(`./auth_info/${sessionId}`, {
//             recursive: true,
//             force: true,
//           });
//           io.to(sessionId).emit('session_invalid', { sessionId });
//           await prisma.session.update({
//             where: { id: sessionId },
//             data:  { status: false }
//           });
//         } else {
//           // network error atau conflict → reconnect tanpa hapus creds
//           io.to(sessionId).emit('disconnected', { sessionId });
//           setTimeout(() => startWhatsApp(io, sessionId), 5000);
//         }
//       }
//     });

//     sock.ev.on('messages.upsert', m => {
//       io.to(sessionId).emit('message', { sessionId, m });
//       validatorWhatsapp(m, sessionId);
//     });

//   } catch (err) {
//     console.error(`Failed to start session ${sessionId}:`, err);
//     setTimeout(() => startWhatsApp(io, sessionId), 5000);
//   }
// };

// export const getClient = (sessionId) => clients.get(sessionId);
// export const getQr = (sessionId) => qrs.get(sessionId);
