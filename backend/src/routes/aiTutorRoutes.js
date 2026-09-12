const express = require("express");
const router = express.Router();
const {
  askStockTutor,
  fetchChatHistory,
} = require("../controllers/aiTutorController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/chat", authMiddleware, askStockTutor);
router.get("/chat/history", authMiddleware, fetchChatHistory);

module.exports = router;