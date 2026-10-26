const jwt = require("jsonwebtoken");
/**
 * Authentication middleware for protected API endpoints.
 * Reads the JWT from the Authorization header and verifies it
 * using the JWT_SECRET environment variable.
 * Attaches the decoded user information to req.user when valid.
 * Returns HTTP 401 when the token is missing, invalid, or expired.
 */
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;