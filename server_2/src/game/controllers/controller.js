import {
  createGameSession,
  getServiceRoundQuestions,
  getServiceTopicQuestions,
  getServiceQuestion,
  endServiceGame,
  endServiceGameForUser,
} from "../services/service.js";

export const createGame = async (req, res) => {
  try {
    const { users } = req.body;
    const game = await createGameSession(users);
    res.json({ gameID: game._id, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoundQuestions = async (req, res) => {
  try {
    const { roundID } = req.params;
    const questions = await getServiceRoundQuestions(roundID);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopicQuestions = async (req, res) => {
  try {
    const { roundID, topicID } = req.params;
    const questions = await getServiceTopicQuestions(roundID, topicID);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestion = async (req, res) => {
  try {
    const { roundID, topicID, questionID } = req.params;
    const question = await getServiceQuestion(roundID, topicID, questionID);
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endGame = async (req, res) => {
  try {
    const result = await endServiceGame();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endGameForUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const score = await endServiceGameForUser(userID);
    res.json({ userID, score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
