const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true
    },
    title: { type: String, required: true },
    content: { type: String, required: true }, // HTML / markdown text
    videoUrl: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    orderIndex: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
