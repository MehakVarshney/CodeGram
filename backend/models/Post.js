const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    user: { type: String, required: false },
    likes: { type: [String], default: [] },

    comments: [
      {
        text: { type: String, required: true },
        user: { type: String, default: "GuestUser" },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
