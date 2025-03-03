// Keep your existing imports
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const cookieParser = require("cookie-parser");
const taskRoutes = require("./routes/taskRoutes");

// Add new imports for authentication
const userRoutes = require("./routes/userRoutes");
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();

app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Your existing middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Keep your existing database connection test
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

// Update your routes
app.use("/api/auth", userRoutes); // Add authentication routes
app.use("/api/tasks", authenticateToken, taskRoutes); // Protect task routes

// Keep your existing welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Task Manager API" });
});

// Keep your existing error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Keep your existing server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
  console.log(`Visit http://localhost:${PORT} to test the API`);
});
