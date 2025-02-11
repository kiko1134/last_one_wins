import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
