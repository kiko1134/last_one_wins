import express from "express";
import authRoutes from "./auth/routes/route.js";
import gameRoutes from "./game/routes/route.js";
import scoreRoutes from "./score/routes/route.js";
import { authenticateToken } from "./auth/middleware/middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/game", authenticateToken, gameRoutes);
router.use("/score", authenticateToken, scoreRoutes);

export default router;
