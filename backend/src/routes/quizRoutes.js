const express = require("express");
const router = express.Router();
const {
  getQuizByLesson,
  saveQuizForLesson
} = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

router.get("/lesson/:lessonId", auth, getQuizByLesson);
router.post("/", auth, requireAdmin, saveQuizForLesson);

module.exports = router;
