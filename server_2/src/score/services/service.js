import Score from "../models/model.js";

export const getScore = async () => {
  return await Score.find();
};

export const updateScore = async (userID, scoreToAdd) => {
  const userScore = await Score.findOneAndUpdate(
    { userID },
    { $inc: { score: scoreToAdd }, updatedAt: new Date() },
    { new: true, upsert: true }
  );
  return userScore;
};
