const { verifyToken } = require("../utils/jwtUtils"); // Import the verifyToken utility

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header (Bearer token)

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  // Verify the token
  const decoded = verifyToken(token); // Use the verifyToken method

  if (!decoded) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }

  // Add the userId and role from the decoded token to the request object for further use in the routes
  req.userId = decoded.userId;
  req.role = decoded.role; // Store role in the request object
  next(); // Proceed to the next middleware/route
};

// Function to check if the user is an admin
const isAdmin = (req, res, next) => {
  // Check if the role in the decoded token is 'admin'
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next(); // Proceed to the next middleware/route if the user is an admin
};

module.exports = { protect, isAdmin };
