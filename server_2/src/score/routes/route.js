import express from "express";
import { fetchScore, modifyScore } from "../controllers/controller.js";

const router = express.Router();

router.get("/", fetchScore);
router.put("/", modifyScore);

export default router;
