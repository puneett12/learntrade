const { askTutor, getChatHistory } = require("../services/aiTutorService");

const askStockTutor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await askTutor(userId, question.trim());

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Tutor Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get tutor response",
    });
  }
};

const fetchChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await getChatHistory(userId);

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Chat History Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};

module.exports = { askStockTutor, fetchChatHistory };