const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const Form = require("../models/form"); // Form model
const User = require("../models/user"); // Assuming you have a User model

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dgly3wq67",
  api_key: "683811984665198", // Replace with your Cloudinary API key
  api_secret: "9IoMZiQthGs3jagC-0R3WBqZsA4", // Replace with your Cloudinary API secret
});

// Multer setup to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images');

// Controller for submitting form with images
const submitForm = async (req, res) => {
  const { name, handle } = req.body;
  const images = req.files; // Files uploaded in the form

  console.log("Received files:", images); // Debugging

  const userId = req.userId; // Get user ID from authentication

  try {
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No images were uploaded" });
    }

    const uploadedImages = [];

    // Use Promise.all to wait for all images to be uploaded
    const uploadPromises = images.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "auto", // Auto detect file type
                folder: "your-folder-name", // Cloudinary folder (optional)
                public_id: file.originalname, // Optional: Set a public ID for the image
              },
              (error, result) => {
                if (error) {
                  return reject(error); // Reject the promise if there's an error
                }
                uploadedImages.push(result.secure_url); // Push the URL of the uploaded image to the array
                resolve(); // Resolve the promise after successful upload
              }
            )
            .end(file.buffer); // Pipe the file buffer to the Cloudinary upload stream
        })
    );

    // Wait for all uploads to finish before saving the form
    await Promise.all(uploadPromises);

    // Create the new form with the uploaded image URLs
    const newForm = new Form({
      user: userId,
      name,
      handle,
      images: uploadedImages,
    });

    // Save the form to the database
    await newForm.save();

    res.status(201).json({
      message: "Form submitted successfully",
      form: newForm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get all form submissions
const getAllForms = async (req, res) => {
  try {
    // Fetch all form submissions
    const forms = await Form.find().populate("user", "email name role"); // Populate user info
    res.status(200).json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get specific form submission by ID (any user can access their own, admins can access anyone's)
const getFormById = async (req, res) => {
  const { formId } = req.params;
  const user = await User.findById(req.userId); // Get the user making the request

  try {
    // Find the form submission by ID
    const form = await Form.findById(formId).populate(
      "user",
      "email name role"
    );

    if (!form) {
      return res.status(404).json({ message: "Form submission not found" });
    }

    // Check if the requesting user is allowed to access the form
    if (user.role === "user" && form.user._id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only view your own form." });
    }

    // Respond with the form submission
    res.status(200).json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update a form submission by ID (only accessible to the user who submitted it or an admin)
const updateForm = async (req, res) => {
  const { formId } = req.params;
  const { name, handle, images } = req.body;
  const user = await User.findById(req.userId);

  try {
    // Find the form submission by ID
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form submission not found" });
    }

    // Check if the user is allowed to update the form
    if (user.role === "user" && form.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only update your own form." });
    }

    // Update the form
    form.name = name || form.name;
    form.handle = handle || form.handle;
    form.images = images || form.images;

    // Save the updated form
    await form.save();

    // Respond with the updated form
    res.status(200).json({ message: "Form updated successfully", form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete a form submission (only accessible to the user who submitted it or an admin)
const deleteForm = async (req, res) => {
  const { formId } = req.params;

  try {
    // Find the form submission by ID
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form submission not found" });
    }

    // Delete the form submission directly
    await Form.findByIdAndDelete(formId);

    // Respond with success message
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  submitForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  upload,
};
