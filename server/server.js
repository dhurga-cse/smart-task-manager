const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (_req, res) => res.json({ status: 'OK', message: 'Smart Task Manager API Running' }));

io.on('connection', (socket) => {
  socket.on('join', (userId) => socket.join(userId));
  socket.on('disconnect', () => {});
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
