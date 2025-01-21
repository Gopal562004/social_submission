const jwt = require("jsonwebtoken");

// Sign JWT Token (Generate Token)
const generateToken = (user) => {
  // Generate a JWT token with an expiration of 1 hour
  return jwt.sign({ userId:user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: "5h" });
};

// Verify JWT Token (Verify Token)
const verifyToken = (token) => {
  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // If token is valid, return the decoded data
  } catch (err) {
    return null; // Return null if verification fails
  }
};

module.exports = { generateToken, verifyToken };
