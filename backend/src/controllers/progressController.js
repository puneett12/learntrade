const Lesson = require("../models/Lesson");
const Module = require("../models/Module");
const LessonProgress = require("../models/LessonProgress");

const buildProgressPayload = async (userId) => {
  const [modules, lessons, progressDocs] = await Promise.all([
    Module.find().sort({ orderIndex: 1 }),
    Lesson.find().sort({ orderIndex: 1 }),
    LessonProgress.find({ userId })
  ]);

  const progressMap = new Map();
  progressDocs.forEach((doc) =>
    progressMap.set(String(doc.lessonId), {
      status: doc.status,
      completedAt: doc.completedAt
    })
  );

  const lessonsByModule = lessons.reduce((acc, lesson) => {
    const key = String(lesson.moduleId);
    if (!acc[key]) acc[key] = [];
    acc[key].push(lesson);
    return acc;
  }, {});

  let totalLessons = lessons.length;
  let totalCompleted = 0;

  const modulesWithProgress = modules.map((moduleDoc) => {
    const moduleLessons = (
      lessonsByModule[String(moduleDoc._id)] || []
    ).slice().sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const lessonDetails = moduleLessons.map((lesson) => {
      const progress = progressMap.get(String(lesson._id));
      if (progress?.status === "completed") totalCompleted += 1;
      return {
        lessonId: lesson._id,
        title: lesson.title,
        status: progress?.status || "not_started",
        completedAt: progress?.completedAt || null
      };
    });

    const completedLessons = lessonDetails.filter(
      (lesson) => lesson.status === "completed"
    ).length;
    const percent =
      moduleLessons.length > 0
        ? Math.round((completedLessons / moduleLessons.length) * 100)
        : 0;

    return {
      moduleId: moduleDoc._id,
      moduleTitle: moduleDoc.title,
      totalLessons: moduleLessons.length,
      completedLessons,
      percent,
      lessons: lessonDetails
    };
  });

  const summary = {
    totalLessons,
    completedLessons: totalCompleted,
    percent: totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
  };

  return { summary, modules: modulesWithProgress };
};

exports.getMyProgress = async (req, res) => {
  try {
    const payload = await buildProgressPayload(req.user.id);
    res.json(payload);
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { status = "completed" } = req.body;

    if (!["not_started", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await LessonProgress.findOneAndUpdate(
      { userId: req.user.id, lessonId },
      {
        status,
        completedAt: status === "completed" ? new Date() : null
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const payload = await buildProgressPayload(req.user.id);
    res.json({ message: "Progress updated", data: payload });
  } catch (err) {
    console.error("Update progress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
