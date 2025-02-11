import express from "express";
import {
  createGame,
  getRoundQuestions,
  getTopicQuestions,
  getQuestion,
  endGame,
  endGameForUser,
} from "../controllers/controller.js";

const router = express.Router();

router.post("/create", createGame);
router.get("/questions/round/:roundID", getRoundQuestions);
router.get(
  "/questions/round/:roundID/topic/:topicID/questions",
  getTopicQuestions
);
router.get(
  "/questions/round/:roundID/topic/:topicID/questions/:questionID",
  getQuestion
);
router.delete("/end", endGame);
router.delete("/end/:userID", endGameForUser);

export default router;
