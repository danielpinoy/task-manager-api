// controllers/taskController.js
const pool = require("../config/db");

// Get all tasks for the logged-in user
const getAllTasks = async (req, res) => {
  try {
    // Get tasks only for the current user
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Create a new task for the logged-in user
const createTask = async (req, res) => {
  const { title, description, status, priority } = req.body;

  try {
    // Include user_id when creating the task
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, status, priority, req.user.userId]
    );

    // Fetch the newly created task to return it
    const [newTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Task created successfully",
      task: newTask[0],
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

// Update a task (only if it belongs to the logged-in user)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  try {
    // First check if the task belongs to this user
    const [existingTask] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.userId]
    );

    if (existingTask.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    // Update the task
    await pool.query(
      "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ? AND user_id = ?",
      [title, description, status, priority, id, req.user.userId]
    );

    // Get the updated task
    const [updatedTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);

    res.json({
      message: "Task updated successfully",
      task: updatedTask[0],
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

// Delete a task (only if it belongs to the logged-in user)
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    // First check if the task belongs to this user
    const [existingTask] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.userId]
    );

    if (existingTask.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    // Delete the task
    await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
      id,
      req.user.userId,
    ]);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Get tasks by status for the logged-in user
const getTasksByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE status = ? AND user_id = ?",
      [status, req.user.userId]
    );
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Get tasks by priority for the logged-in user
const getTasksByPriority = async (req, res) => {
  const { priority } = req.params;

  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE priority = ? AND user_id = ?",
      [priority, req.user.userId]
    );
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by priority:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Get a specific task by ID (only if it belongs to the logged-in user)
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    // Query includes user_id check to ensure users can only access their own tasks
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.userId]
    );

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.json(tasks[0]);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task" });
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
