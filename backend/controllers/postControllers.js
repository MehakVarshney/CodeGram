// backend/controllers/postController.js
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { user, caption, image, category } = req.body;
    const newPost = new Post({ user, caption, image, category });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};
