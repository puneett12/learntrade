const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true
    },
    title: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
