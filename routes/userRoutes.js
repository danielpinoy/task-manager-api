// routes/userRoutes.js

// Import the Express router to define routes
const express = require("express");
const router = express.Router();

// Import the user controller functions that handle the route logic
const {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
} = require("../controllers/userController");

// Import the authentication middleware for protected routes
const { authenticateToken } = require("../middleware/authMiddleware");

// Define routes for user authentication and profile management
// POST /api/auth/register - Create a new user account
router.post("/register", register);

// POST /api/auth/login - Authenticate user and get token
router.post("/login", login);

// GET /api/auth/profile - Get user profile (protected route)
router.get("/profile", authenticateToken, getProfile);

// POST /api/auth/refresh - Refresh access token using refresh token
router.post("/refresh", refreshToken);

// POST /api/auth/logout - Logout user and clear cookies
router.post("/logout", logout);

// GET /api/auth/me - Check current authentication status
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    isAuthenticated: true,
    userId: req.user.userId,
    email: req.user.email,
  });
});

// Export the router for use in the main application
module.exports = router;
