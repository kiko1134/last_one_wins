import express, {static as static_, urlencoded} from 'express';
import {createServer} from 'http';
import {Server as SocketServer} from 'socket.io';
import pkg from 'body-parser';
import {PORT, STATIC_DIR_CLIENT, STATIC_DIR_GAME_LOGIC} from './config/config.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import socketController from './controllers/socketController.js';
import mongoose from "mongoose";

const {json} = pkg;

const app = express();
const server = createServer(app);
const io = new SocketServer(server); // Socket.io initialization

// Middleware
app.use(json());
app.use(urlencoded({extended: true}));
app.use(static_(STATIC_DIR_CLIENT));
app.use("/game-logic", static_(STATIC_DIR_GAME_LOGIC));

// Routes usage
app.use('/', indexRoutes);
app.use('/', authRoutes);   // For /register and /login
app.use('/game', gameRoutes); // For /game/create


const uri = "mongodb+srv://kristianyordanov156:Hvt6Bc9m6JczVWJk@cluster0.555sa.mongodb.net/LastOneWins?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

mongoose.connect(uri, clientOptions)
    .then( () => {
        console.log("Connected to MongoDB!");
        //Идеята е да се стартира сървъра само след като се установи връзката с базата данни
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });


// Socket.io events initialization
socketController(io);