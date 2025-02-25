// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// This middleware verifies the JWT token sent in the cookie or the authorization header
const authenticateToken = (req, res, next) => {
  // First check for token in cookies (preferred method)
  let token = req.cookies.accessToken;

  // Fallback to checking Authorization header for backward compatibility
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1];
  }

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
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateToken };
