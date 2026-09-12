const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

exports.getQuizByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      return res.status(404).json({ message: "No quiz for this lesson" });
    }
    const questions = await Question.find({ quizId: quiz._id });
    res.json({ quiz, questions });
  } catch (err) {
    console.error("Get quiz error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveQuizForLesson = async (req, res) => {
  try {
    const { lessonId, title, questions } = req.body || {};
    if (!lessonId || !title) {
      return res.status(400).json({ message: "lessonId and title are required" });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Provide at least one question for the quiz" });
    }

    for (const [index, question] of questions.entries()) {
      const correctOption = (question.correctOption || "").toUpperCase();
      if (
        !question.questionText ||
        !question.optionA ||
        !question.optionB ||
        !correctOption
      ) {
        return res
          .status(400)
          .json({ message: `Question ${index + 1} is missing required fields` });
      }
      if (!["A", "B", "C", "D"].includes(correctOption)) {
        return res.status(400).json({
          message: `Question ${index + 1} has invalid correctOption`
        });
      }
      if (
        (correctOption === "C" && !question.optionC) ||
        (correctOption === "D" && !question.optionD)
      ) {
        return res.status(400).json({
          message: `Question ${index + 1} is missing the option referenced by correctOption`
        });
      }
      question.correctOption = correctOption;
    }

    let quiz = await Quiz.findOne({ lessonId });
    if (quiz) {
      quiz.title = title;
      await quiz.save();
    } else {
      quiz = await Quiz.create({ lessonId, title });
    }

    await Question.deleteMany({ quizId: quiz._id });

    const formattedQuestions = questions.map((question) => ({
      quizId: quiz._id,
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC || "",
      optionD: question.optionD || "",
      correctOption: question.correctOption,
      explanation: question.explanation || ""
    }));

    const createdQuestions = await Question.insertMany(formattedQuestions);

    res.json({
      message: "Quiz saved",
      quiz,
      questions: createdQuestions
    });
  } catch (err) {
    console.error("Save quiz error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
