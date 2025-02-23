// controllers/userController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Register a new user
const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await pool.query(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Debug: Check if JWT_SECRET is available
    console.log(
      "JWT_SECRET check:",
      process.env.JWT_SECRET ? "Present" : "Missing"
    );

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Make sure JWT_SECRET exists before using it
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    // Get user data from database (excluding password)
    const [users] = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = ?",
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
