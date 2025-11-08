// backend/routes/postRoutes.js
const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const Post = require("../models/Post");

const router = express.Router();

// 🟢 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CodeGram_Posts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// 🟢 Create a new post with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { caption, category } = req.body;
    const image = req.file ? req.file.path : null;

    const newPost = new Post({ caption, category, image });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// 🟢 Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

module.exports = router;
