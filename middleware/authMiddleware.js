// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// This middleware verifies the JWT token sent in the request header
const authenticateToken = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers["authorization"];

  // The token is sent as "Bearer <token>", so we split and get the second part
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    // Verify the token using our JWT secret
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user data to the request object so route handlers can access it
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authenticateToken };
