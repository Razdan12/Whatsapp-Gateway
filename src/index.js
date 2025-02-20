import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import apiTokenRoutes from './routes/apiToken.routes.js';
import sessionRoutes from './routes/session.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import { waAuthMiddleware } from './middleware/waAuth.js';

const app = express();
const port = process.env.PORT || 3000;

// Parsing JSON body untuk request
app.use(express.json());

// Public routes (tanpa proteksi JWT/API token)
app.use('/auth', authRoutes);
app.use('/auth', apiTokenRoutes);

// Buat server HTTP dan inisialisasi Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Simpan instance global untuk Socket.IO, client WhatsApp, dan QR code masing-masing session
globalThis.io = io;
globalThis.whatsappClients = {};
globalThis.latestQrs = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Misalnya, bisa mengirimkan QR code default jika tersedia, atau menunggu update dari session
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Protected routes: hanya diakses jika API token valid
app.use('/session', waAuthMiddleware, sessionRoutes);
app.use('/wa', waAuthMiddleware, whatsappRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
