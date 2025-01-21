const mongoose = require("mongoose");


const formSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, 
  name: { type: String, required: true },
  handle: { type: String, required: true },
  images: [{ type: String }], 
});

module.exports = mongoose.model("Form", formSchema);
