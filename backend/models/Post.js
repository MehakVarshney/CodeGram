const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // 👈 make not required
  likes: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
