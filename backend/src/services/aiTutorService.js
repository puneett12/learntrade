const ChatMessage = require("../models/ChatMessage");
const buildTutorMessages = require("../utils/tutorPrompt");
const { getTutorReply } = require("./openaiService");

const askTutor = async (userId, question) => {
  const recentMessages = await ChatMessage.find({ userId })
    .sort({ createdAt: -1 })
    .limit(6);

  const formattedHistory = recentMessages
    .reverse()
    .map((msg) => ({
      role: msg.role,
      content: msg.message,
    }));

  const messages = buildTutorMessages(question, formattedHistory);
  const answer = await getTutorReply(messages);

  await ChatMessage.create([
    {
      userId,
      role: "user",
      message: question,
    },
    {
      userId,
      role: "assistant",
      message: answer,
    },
  ]);

  return answer;
};

const getChatHistory = async (userId) => {
  const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 });
  return messages;
};

module.exports = { askTutor, getChatHistory };