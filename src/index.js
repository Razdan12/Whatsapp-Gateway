// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import httpStatus from 'http-status-codes';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import router from './routes.js';
import handleError from './exceptions/handler.exception.js';
import { startAllService } from './provider/whatsappStarted.js';

dotenv.config();

const app  = express();
const port = process.env.PORT || 3000;

// Middleware
app.disable('x-powered-by');
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION', credentials: true }));
app.use(bodyParser.json({ limit: '50mb', type: ['application/json', 'application/vnd.api+json'] }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 50000, extended: true }));
app.use(bodyParser.raw({ type: ['application/json', 'application/vnd.api+json'] }));
app.use(bodyParser.text({ type: 'text/html' }));

// HTTP & Socket.IO setup
const server = http.createServer(app);
const io     = new IOServer(server, { cors: { origin: '*' } });

// Make io accessible in routes
app.set('io', io);

startAllService(io)
// ——— Socket.IO connection handler ———
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  // Client bergabung ke room session-specific
  socket.on('join-room', room => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Client keluar dari room
  socket.on('leave-room', room => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/v1', router);

app.route('/').get((req, res) => {
  return res.json({ message: 'Welcome to the API' });
});

// 404 handler
app.use((req, res) => {
  return res.json({
    errors: {
      status: res.statusCode,
      data: null,
      error: {
        code: httpStatus.StatusCodes.NOT_FOUND,
        message: 'ENDPOINT_NOTFOUND',
      },
    },
  });
});

// Global error handler
app.use(handleError);

// Start server
server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});

// BigInt JSON parsing
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
