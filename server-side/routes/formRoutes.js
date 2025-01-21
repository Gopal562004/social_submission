const express = require("express");
const {
  submitForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  upload,
} = require("../controllers/fromController");
const { protect, isAdmin } = require("../middleware/authMiddleware"); // Protect and admin middleware

const router = express.Router();

// POST request to submit a form (user)
router.post("/submit", protect, upload, submitForm);

// GET request to fetch all form submissions (admin only)
router.get("/all", protect, isAdmin, getAllForms);

// GET request to fetch a specific form submission by ID (user or admin)
router.get("/:formId", protect, getFormById);

// PUT request to update a form submission by ID (user or admin)
router.put("/:formId", protect, isAdmin, updateForm);

// DELETE request to delete a form submission by ID (user or admin)
router.delete("/:formId", protect, isAdmin, deleteForm);

module.exports = router;
