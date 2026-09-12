const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    orderIndex: { type: Number, default: 0 },
    coverImage: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);
