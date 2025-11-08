const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
const User = require("../models/User");

// 🟢 Create a new post
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { caption, image, category } = req.body;
    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    const newPost = new Post({
      user: req.user.id,
      caption,
      image,
      category,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 Get all posts (feed)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 Get posts of a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❤️ Like / Unlike post (with notification)
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);

      // 🔔 Create notification only if liking someone else’s post
      if (post.user.toString() !== userId) {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💬 Add comment (with notification)
router.put("/comment/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    // 🔔 Create notification only if commenting on someone else’s post
    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.user,
        sender: req.user.id,
        type: "comment",
        post: post._id,
      });
    }

    const updatedPost = await Post.findById(req.params.id)
      .populate("comments.user", "username profilePic");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 Delete post
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Feed (followed users + own posts)
router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followingIds = user.following;

    const posts = await Post.find({
      user: { $in: [...followingIds, req.user.id] },
    })
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟣 Explore page (by category / trending)
router.get("/explore", async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ likes: -1, createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
