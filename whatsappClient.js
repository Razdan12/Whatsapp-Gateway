// import pkg from 'baileys';
// import pino from 'pino';
// import fs from 'fs/promises';
// import { validatorWhatsapp } from '../provider/validator.js';
// import prisma from '../config/prisma.db.js';

// const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// const clients = new Map(); // sessionId → socket instance
// const qrs = new Map(); // sessionId → latest QR code

// export const startWhatsApp = async (io, sessionId) => {
//   if (clients.has(sessionId)) {
//     console.log('sesion return', sessionId);
//     io.to(sessionId).emit('connected', { sessionId });
//     return;
//   }

//   try {
//     const { state, saveCreds: origSaveCreds } = await useMultiFileAuthState(
//       `./auth_info/${sessionId}`
//     );

//     const saveCreds = async (...args) => {
//       try {
//         await origSaveCreds(...args);
//       } catch {
//         /* ignore */
//       }
//     };

//     const sock = makeWASocket({
//       auth: state,
//       printQRInTerminal: false,
//       syncFullHistory: false,
//       defaultQueryTimeoutMs: undefined,
//       logger: pino({ level: 'error' }), // ← semua log dibungkam
//     });

//     clients.set(sessionId, sock);
//     sock.ev.on('creds.update', saveCreds);

//     sock.ev.on('connection.update', async (update) => {
//       const { connection, lastDisconnect, qr } = update;

//       if (qr) {
//         qrs.set(sessionId, qr);
//         io.to(sessionId).emit('qr', { sessionId, qr });
//       }

//       if (connection === 'open') {
//         io.to(sessionId).emit('connected', { sessionId });
//         await updateSession(sessionId, true);
//       }

//       if (connection === 'close') {
//         const code = lastDisconnect?.error?.output?.statusCode;
//         const msg = lastDisconnect?.error?.message || '';
//         const isLoggedOut = code === DisconnectReason.loggedOut;
//         const isConflict =
//           msg.toLowerCase().includes('conflict') ||
//           code === DisconnectReason.connectionReplaced;

//         // **Tutup socket lama** dan hapus listener
//         sock.ev.removeAllListeners();
//         try {
//           await sock.end();
//         } catch {}

//         // Hapus dari map
//         clients.delete(sessionId);
//         qrs.delete(sessionId);

//         if (isLoggedOut) {
//           // benar-benar logout → hapus creds
//           try {
//             await fs.rm(`./auth_info/${sessionId}`, {
//               recursive: true,
//               force: true,
//             });
//           } catch (e) {
//             /* ignore */
//           }
//           io.to(sessionId).emit('session_invalid', { sessionId });
//           await updateSession(sessionId, false);
//         } else {
//           // termasuk conflict → reconnect saja
//           io.to(sessionId).emit('disconnected', { sessionId });
//           setTimeout(() => startWhatsApp(io, sessionId), 5000);
//         }
//       }
//     });

//     sock.ev.on('messages.upsert', (m) => {
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

// const updateSession = async (id, status) => {
//   await prisma.session.update({ where: { id }, data: { status } });
// };
