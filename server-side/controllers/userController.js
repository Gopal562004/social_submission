const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils"); // Import JWT utility

// Sign Up Controller
const signup = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      email,
      password,
      role,
    });

    // Save the user (password will be hashed automatically via pre-save hook)
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser); // Use the generateToken method

    // Respond with the token
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user); // Use the generateToken method

    // Respond with the token
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
//admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the user's role is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user); // Use the generateToken method

    // Respond with the token
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  signup,
  login,
  adminLogin,
};
