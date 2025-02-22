// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority,
} = require("../controllers/taskController");

// Basic CRUD routes
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Additional routes
router.get("/status/:status", getTasksByStatus);
router.get("/priority/:priority", getTasksByPriority);

module.exports = router;
