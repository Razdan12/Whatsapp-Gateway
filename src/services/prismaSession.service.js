import prisma from '../config/prismaClient.js';
import { initAuthCreds } from '@whiskeysockets/baileys';

export async function loadAuthState(sessionId) {
  const session = await prisma.session.findUnique({
    where: { sessionId },
  });
  if (session && session.authState) {
    // Jika terdapat auth state tersimpan, kembalikan hasil cast
    return session.authState;
  }
  // Jika belum ada, kembalikan default auth state dengan creds terinisialisasi
  return { creds: initAuthCreds(), keys: {} };
}

export async function saveAuthState(sessionId, authState) {
  // Pastikan authState merupakan objek JSON murni (serialisasi)
  const safeAuthState = JSON.parse(JSON.stringify(authState));
  await prisma.session.upsert({
    where: { sessionId },
    update: { authState: safeAuthState },
    create: { sessionId, authState: safeAuthState },
  });
}
