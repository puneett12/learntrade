const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },
    questionText: { type: String, required: true },
    optionA: { type: String, required: true },
    optionB: { type: String, required: true },
    optionC: { type: String },
    optionD: { type: String },
    correctOption: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true
    },
    explanation: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
