const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

exports.submitAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // [{questionId, selectedOption}]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const questions = await Question.find({ quizId });
    const questionMap = new Map();
    questions.forEach((q) => questionMap.set(String(q._id), q));

    let score = 0;
    const detailed = [];

    answers.forEach((ans) => {
      const q = questionMap.get(ans.questionId);
      if (!q) return;
      const isCorrect = q.correctOption === ans.selectedOption;
      if (isCorrect) score++;
      detailed.push({
        questionId: q._id,
        questionText: q.questionText,
        selectedOption: ans.selectedOption || "",
        correctOption: q.correctOption,
        explanation: q.explanation,
        isCorrect
      });
    });

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      quizId,
      score,
      total: questions.length
    });

    res.json({
      attemptId: attempt._id,
      score,
      total: questions.length,
      details: detailed
    });
  } catch (err) {
    console.error("Submit attempt error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
