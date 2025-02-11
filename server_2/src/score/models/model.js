import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Score", ScoreSchema);
