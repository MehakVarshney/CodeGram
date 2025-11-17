const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const Post = require("../models/Post");

const router = express.Router();

// 🟢 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.api.ping()
  .then(res => console.log("Cloudinary Connected ✔", res))
  .catch(err => console.log("Cloudinary Error ❌", err.message));


console.log("✅ Cloudinary loaded:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗ Missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗ Missing"
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

// 🟢 Create a new post with image upload (with better debugging)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📸 Incoming Post Request:");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const express = require("express");
    const multer = require("multer");
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const cloudinary = require("cloudinary").v2;
    require("dotenv").config();
    const Post = require("../models/Post");

    const router = express.Router();

    // 🟢 Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinary.api.ping()
      .then(res => console.log("Cloudinary Connected ✔", res))
      .catch(err => console.log("Cloudinary Error ❌", err.message));


    console.log("✅ Cloudinary loaded:", {
      name: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗ Missing",
      secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗ Missing"
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

    // 🟢 Create a new post with image upload (with better debugging)
    router.post("/", upload.single("image"), async (req, res) => {
      try {
        console.log("📸 Incoming Post Request:");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { caption, category } = req.body;
        const image = req.file ? req.file.path : null;

        if (!caption || !category) {
          return res.status(400).json({ message: "Caption and category are required." });
        }

        const newPost = new Post({ caption, category, image });
        await newPost.save();

        console.log("✅ Post saved:", newPost);
        res.status(201).json(newPost);
      } catch (error) {
        console.error("🔥 Error creating post:", error);
        res.status(500).json({ message: error.message || "Failed to create post" });
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


    // 🗑️ Delete a post by ID
    router.delete("/:id", async (req, res) => {
      try {
        const post = await Post.findById(req.params.id);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }

        // 🧠 Only delete from Cloudinary if the post actually has an image URL
        if (post.image && post.image.includes("cloudinary.com")) {
          const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
          const folder = "CodeGram_Posts";
          await cloudinary.uploader.destroy(`${folder}/${publicId}`);
          console.log(`🗑️ Deleted Cloudinary image: ${folder}/${publicId}`);
        } else {
          console.log("⚠️ Skipped Cloudinary deletion (no image found)");
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Error deleting post" });
      }
    });
    // ❤️ Like / Unlike a post
    router.put("/:id/like", async (req, res) => {
      try {
        const { userId } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // If user already liked → Unlike
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          post.likes.push(userId);
        }

        await post.save();
        res.json({ likes: post.likes.length, likedBy: post.likes });
      } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Error liking post" });
      }
    });

    // 📝 Add comment to a post
    router.post("/:id/comment", async (req, res) => {
      try {
        const { text, user } = req.body;

        if (!text) return res.status(400).json({ message: "Comment text required" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({
          text,
          user: user || "GuestUser",
          createdAt: new Date()
        });

        await post.save();
        res.json(post);
      } catch (error) {
        console.error("Comment error:", error);
        res.status(500).json({ message: "Failed to add comment" });
      }
    });


    // 🧑‍💻 Get posts of a specific user
    router.get("/user/:userId", async (req, res) => {
      try {
        const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(posts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Error fetching user posts" });
      }
    });


    module.exports = router;


    if (!caption || !category) {
      return res.status(400).json({ message: "Caption and category are required." });
    }

    const newPost = new Post({ caption, category, image });
    await newPost.save();

    console.log("✅ Post saved:", newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("🔥 Error creating post:", error);
    res.status(500).json({ message: error.message || "Failed to create post" });
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


// 🗑️ Delete a post by ID
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🧠 Only delete from Cloudinary if the post actually has an image URL
    if (post.image && post.image.includes("cloudinary.com")) {
      const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
      const folder = "CodeGram_Posts";
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      console.log(`🗑️ Deleted Cloudinary image: ${folder}/${publicId}`);
    } else {
      console.log("⚠️ Skipped Cloudinary deletion (no image found)");
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});
// ❤️ Like / Unlike a post
router.put("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // If user already liked → Unlike
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, likedBy: post.likes });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error liking post" });
  }
});

// 📝 Add comment to a post
router.post("/:id/comment", async (req, res) => {
  try {
    const { text, user } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      text,
      user: user || "GuestUser",
      createdAt: new Date()
    });

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});


// 🧑‍💻 Get posts of a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching user posts" });
  }
});


module.exports = router;
