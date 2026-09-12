const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const progress =
      (await LessonProgress.findOne({
        userId: req.user.id,
        lessonId: lesson._id
      })) || null;

    const lessonData = lesson.toObject();
    lessonData.progressStatus = progress?.status || "not_started";
    lessonData.completedAt = progress?.completedAt || null;

    res.json(lessonData);
  } catch (err) {
    console.error("Get lesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const {
      moduleId,
      title,
      content,
      videoUrl = "",
      durationMinutes = 0,
      difficulty = "beginner",
      orderIndex = 0
    } = req.body;

    if (!moduleId || !title || !content) {
      return res.status(400).json({ message: "moduleId, title and content are required" });
    }

    const lesson = await Lesson.create({
      moduleId,
      title,
      content,
      videoUrl,
      durationMinutes,
      difficulty,
      orderIndex
    });

    res.status(201).json(lesson);
  } catch (err) {
    console.error("Create lesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updates = req.body || {};

    const lesson = await Lesson.findByIdAndUpdate(lessonId, updates, {
      new: true,
      runValidators: true
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error("Update lesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const deleted = await Lesson.findByIdAndDelete(lessonId);
    if (!deleted) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await LessonProgress.deleteMany({ lessonId });
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    console.error("Delete lesson error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
