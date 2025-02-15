import express, { urlencoded, static as static_ } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import pkg from 'body-parser';
const { json } = pkg;

import { STATIC_DIR_CLIENT, STATIC_DIR_GAME_LOGIC, PORT } from './config/config.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import socketController from './controllers/socketController.js';
const app = express();
const server = createServer(app);
const io = new SocketServer(server); // Socket.io initialization

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(static_(STATIC_DIR_CLIENT));
app.use("/game-logic", static_(STATIC_DIR_GAME_LOGIC));

// Routes usage
app.use('/', indexRoutes);
app.use('/', authRoutes);   // For /register and /login
app.use('/game', gameRoutes); // For /game/create

// Socket.io events initialization
socketController(io);

server.listen(PORT, () => {
    console.log(`Сървърът работи на порт ${PORT}`);
});
