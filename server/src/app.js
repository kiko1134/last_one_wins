const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { join } = require('path');

const config = require('./config/config');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(config.STATIC_DIR));

// Routes usage
app.use('/', indexRoutes);
app.use('/', authRoutes);   // For /register and /login
app.use('/game', gameRoutes); // For /game/create

// Socket.io events initialization
require('./controllers/socketController')(io);

server.listen(config.PORT, () => {
    console.log(`Сървърът работи на порт ${config.PORT}`);
});
