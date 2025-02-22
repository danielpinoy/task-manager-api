const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection successful! ✨");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

testConnection();

// Routes
app.use("/api/tasks", taskRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Task Manager API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
  console.log(`Visit http://localhost:${PORT} to test the API`);
});
