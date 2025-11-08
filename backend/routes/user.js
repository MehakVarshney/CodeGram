const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// 🧾 Get user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕➖ Follow / Unfollow user
router.put("/follow/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.followers?.includes(req.user.id)) {
      // Unfollow
      targetUser.followers = targetUser.followers.filter(
        (uid) => uid.toString() !== req.user.id
      );
      currentUser.following = currentUser.following.filter(
        (uid) => uid.toString() !== req.params.id
      );
      await targetUser.save();
      await currentUser.save();
      res.json({ message: "User unfollowed" });
    } else {
      // Follow
      targetUser.followers.push(req.user.id);
      currentUser.following.push(req.params.id);
      await targetUser.save();
      await currentUser.save();
      res.json({ message: "User followed" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📝 Update user bio or profile picture
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { bio, profilePic } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio, profilePic },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
