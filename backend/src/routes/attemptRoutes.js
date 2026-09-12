const express = require("express");
const router = express.Router();
const { submitAttempt } = require("../controllers/attemptController");
const auth = require("../middleware/authMiddleware");

router.post("/:quizId", auth, submitAttempt);

module.exports = router;
