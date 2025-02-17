import { Server as SocketServer } from "socket.io";
import express, { static as static_, urlencoded } from "express";
import { createServer } from "http";
import pkg from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import sharedSession from "express-socket.io-session";
import {
  STATIC_DIR_CLIENT,
  STATIC_DIR_GAME_LOGIC,
} from "./config/config.js";
import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/game.js";
import socketController from "./controllers/socketController.js";

dotenv.config();

const { json } = pkg;
const app = express();
const server = createServer(app);
const io = new SocketServer(server);

// MongoDB connection
const uri =
  "mongodb+srv://kristianyordanov156:Hvt6Bc9m6JczVWJk@cluster0.555sa.mongodb.net/LastOneWins?retryWrites=true&w=majority&appName=Cluster0";
const sessionSecret = "KrVStTVaP";
const port = process.env.PORT || 3000;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB!");
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/js", express.static(STATIC_DIR_CLIENT + "/js"));
app.use("/css", express.static(STATIC_DIR_CLIENT + "/css"));
app.use("/img", express.static(STATIC_DIR_CLIENT + "/img"));
app.use('/index', express.static(STATIC_DIR_CLIENT + "/index.html"));
app.use('/login', express.static(STATIC_DIR_CLIENT + "/login.html"));
app.use('/register', express.static(STATIC_DIR_CLIENT + "/register.html"));
app.use('/game', express.static(STATIC_DIR_CLIENT + "/game.html"));
app.use("/game-logic", static_(STATIC_DIR_GAME_LOGIC));

// Session Middleware
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: MongoStore.create({ mongoUrl: uri }),
});

app.use(sessionMiddleware);

// Routes usage
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

// Integrate session with Socket.io
io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true,
  })
);

// Socket.io events initialization
socketController(io);

// import express, { static as static_, urlencoded } from "express";
// import { createServer } from "http";
// import { Server as SocketServer } from "socket.io";
// import pkg from "body-parser";
// import {
//   PORT,
//   STATIC_DIR_CLIENT,
//   STATIC_DIR_GAME_LOGIC,
// } from "./config/config.js";
// import indexRoutes from "./routes/index.js";
// import authRoutes from "./routes/auth.js";
// import gameRoutes from "./routes/game.js";
// import socketController from "./controllers/socketController.js";
// import mongoose from "mongoose";
// import session from "express-session";
// import MongoStore from "connect-mongo";

// const { json } = pkg;

// const app = express();
// const server = createServer(app);
// const io = new SocketServer(server); // Socket.io initialization

// // Middleware
// app.use(json());
// app.use(urlencoded({ extended: true }));
// app.use(static_(STATIC_DIR_CLIENT));
// app.use("/game-logic", static_(STATIC_DIR_GAME_LOGIC));

// // Routes usage
// app.use("/", indexRoutes);
// app.use("/auth", authRoutes); // For /register and /login
// app.use("/game", gameRoutes); // For /game/create

// const uri =
//   "mongodb+srv://kristianyordanov156:Hvt6Bc9m6JczVWJk@cluster0.555sa.mongodb.net/LastOneWins?retryWrites=true&w=majority&appName=Cluster0";
// const clientOptions = {
//   serverApi: { version: "1", strict: true, deprecationErrors: true },
// };

// mongoose
//   .connect(uri, clientOptions)
//   .then(() => {
//     console.log("Connected to MongoDB!");
//     //Идеята е да се стартира сървъра само след като се установи връзката с базата данни
//     server.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// app.use(
//   session({
//     secret: "KrVStTVaP", // Трябва да е защитено в .env
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 седмица
//     store: MongoStore.create({ mongoUrl: uri }), // Съхранява сесиите в MongoDB
//   })
// );

// // Socket.io events initialization
// socketController(io);
