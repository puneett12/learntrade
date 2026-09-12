const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ orderIndex: 1 });
    res.json(modules);
  } catch (err) {
    console.error("Get modules error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc)
      return res.status(404).json({ message: "Module not found" });

    const lessons = await Lesson.find({ moduleId }).sort({ orderIndex: 1 });
    res.json({ module: moduleDoc, lessons });
  } catch (err) {
    console.error("Get module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { title, description, orderIndex = 0, coverImage = "" } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const moduleDoc = await Module.create({
      title,
      description,
      orderIndex,
      coverImage
    });
    res.status(201).json(moduleDoc);
  } catch (err) {
    console.error("Create module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const updates = req.body || {};

    const updated = await Module.findByIdAndUpdate(moduleId, updates, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const moduleDoc = await Module.findByIdAndDelete(moduleId);
    if (!moduleDoc) {
      return res.status(404).json({ message: "Module not found" });
    }

    const lessons = await Lesson.find({ moduleId });
    const lessonIds = lessons.map((l) => l._id);

    await Lesson.deleteMany({ moduleId });
    if (lessonIds.length > 0) {
      await LessonProgress.deleteMany({ lessonId: { $in: lessonIds } });
    }

    res.json({ message: "Module deleted" });
  } catch (err) {
    console.error("Delete module error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
