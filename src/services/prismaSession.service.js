import prisma from '../config/prismaClient.js';
import { initAuthCreds } from '@whiskeysockets/baileys';

export async function loadAuthState(sessionId) {
  const session = await prisma.session.findUnique({
    where: { sessionId },
  });
  if (session && session.authState) {
    return session.authState;
  }
  // Jika belum ada, inisialisasi dengan kredensial default
  return { creds: initAuthCreds(), keys: {} };
}

export async function saveAuthState(sessionId, authState) {
  const safeAuthState = JSON.parse(JSON.stringify(authState));
  await prisma.session.upsert({
    where: { sessionId },
    update: { authState: safeAuthState },
    create: { sessionId, authState: safeAuthState },
  });
}
