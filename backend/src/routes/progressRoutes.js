const express = require("express");
const router = express.Router();
const {
  getMyProgress,
  updateLessonProgress
} = require("../controllers/progressController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getMyProgress);
router.post("/:lessonId", auth, updateLessonProgress);

module.exports = router;

