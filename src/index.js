import express from 'express';
import authRoutes from './routes/authRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { startWhatsApp } from './utils/whatsappClient.js';

const app = express();
app.disable('x-powered-by');
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
);

const port = process.env.PORT || 3000;
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.get('/', (req, res) => {
  res.send('Server Express dengan Baileys sudah berjalan!');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected: ' + socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

startWhatsApp(io)
  .then(() => {
    console.log('WhatsApp client started');
  })
  .catch((err) => console.error(err));

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
