const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");


// 🔍 Search users by username
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "No search query provided" });

    // Case-insensitive search for username
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username profilePic bio");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🌍 Explore public posts (all users)
router.get("/explore", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
