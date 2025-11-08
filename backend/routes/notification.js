// backend/routes/notification.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

// 🟢 Get all notifications for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate("from", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 Mark all notifications as read
router.put("/read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 Delete a notification
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
