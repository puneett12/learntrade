const path = require("path");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const aiTutorRoutes = require("./routes/aiTutorRoutes");

// Debug check
console.log("OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/ai-tutor", aiTutorRoutes);

app.get("/", (req, res) => {
  res.send("Stock Market Learning Portal API");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/modules", require("./routes/moduleRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/attempts", require("./routes/attemptRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});