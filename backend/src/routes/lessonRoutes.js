const express = require("express");
const router = express.Router();
const {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} = require("../controllers/lessonController");
const auth = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

router.get("/:id", auth, getLessonById);
router.post("/", auth, requireAdmin, createLesson);
router.patch("/:id", auth, requireAdmin, updateLesson);
router.delete("/:id", auth, requireAdmin, deleteLesson);

module.exports = router;
