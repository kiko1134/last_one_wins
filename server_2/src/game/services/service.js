import Game from "../models/model.js";

export const createGameSession = async (users) => {
  const game = new Game({ users });
  return await game.save();
};

export const getServiceRoundQuestions = async (roundID) => {
  return { roundID, topics: ["Topic1", "Topic2"] };
};

export const getServiceTopicQuestions = async (roundID, topicID) => {
  return { roundID, topicID, questions: ["Q1", "Q2"] };
};

export const getServiceQuestion = async (roundID, topicID, questionID) => {
  return { roundID, topicID, questionID, question: "Sample question?" };
};

export const endServiceGame = async () => {
  // Fetch the game, determine the winner, and update status
  return { winner: "user123", score: { user123: 50, user456: 40 } };
};

export const endServiceGameForUser = async (userID) => {
  // Fetch user score and update it
  return { userID, score: 30 };
};
