const express = require("express");
const router = express.Router();
const {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule
} = require("../controllers/moduleController");
const auth = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

router.get("/", auth, getModules);
router.get("/:id", auth, getModuleById);
router.post("/", auth, requireAdmin, createModule);
router.patch("/:id", auth, requireAdmin, updateModule);
router.delete("/:id", auth, requireAdmin, deleteModule);

module.exports = router;
