import { getScore, updateScore } from "../services/service.js";

export const fetchScore = async (req, res) => {
  try {
    const scores = await getScore();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const modifyScore = async (req, res) => {
  try {
    const { userID, scoreToAdd } = req.body;
    const updatedScore = await updateScore(userID, scoreToAdd);
    res.json(updatedScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
