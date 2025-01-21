const express = require("express");
const { signup, login, adminLogin } = require("../controllers/userController");
const router = express.Router();
// POST request for user signup
router.post("/signup", signup);
// POST request for user login
router.post("/login", login);
router.post("/adminlogin", adminLogin);
module.exports = router;
