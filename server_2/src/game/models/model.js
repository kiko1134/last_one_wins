import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["IN_PROGRESS", "COMPLETED"],
    default: "IN_PROGRESS",
  },
  rounds: [
    {
      roundID: String,
      topics: [
        {
          topicID: String,
          questions: [
            {
              questionID: String,
              questionText: String,
              options: [String],
              correctAnswer: String,
              points: Number,
            },
          ],
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Game", GameSchema);
