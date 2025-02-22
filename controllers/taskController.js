// controllers/taskController.js
const pool = require("../config/db");

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks ORDER BY date DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching task" });
  }
};

// Create new task
const createTask = async (req, res) => {
  const {
    title,
    description,
    status = "not-started",
    priority = "low",
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, status, date, priority) VALUES (?, ?, ?, CURDATE(), ?)",
      [title, description, status, priority]
    );

    const [newTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

// Update task
const updateTask = async (req, res) => {
  const { title, description, status, priority } = req.body;
  const { id } = req.params;

  try {
    const [existingTask] = await pool.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );
    if (existingTask.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    await pool.query(
      "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?",
      [
        title || existingTask[0].title,
        description || existingTask[0].description,
        status || existingTask[0].status,
        priority || existingTask[0].priority,
        id,
      ]
    );

    const [updatedTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);
    res.json(updatedTask[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Get tasks by status
const getTasksByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE status = ?", [
      status,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching tasks by status" });
  }
};

// Get tasks by priority
const getTasksByPriority = async (req, res) => {
  const { priority } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE priority = ?", [
      priority,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching tasks by priority" });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority,
};
