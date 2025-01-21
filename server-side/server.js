// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const formRoutes = require("./routes/formRoutes");
const connectDB = require("./config/db")
const app = express();
require("dotenv").config();

// Middleware setup
app.use(cors());
app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // for parsing form data

// Routes
app.use("/users", userRoutes);
app.use("/forms", formRoutes);

// Database connection
connectDB();
// Server setup
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
