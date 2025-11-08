// backend/routes/feed.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// 📰 Get feed posts (from followed users + self)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // All IDs to fetch posts for
    const ids = [...user.following, user._id];

    // Fetch posts by these users
    const posts = await Post.find({ user: { $in: ids } })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
