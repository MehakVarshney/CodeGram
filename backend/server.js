// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes"); // ✅ rename to postRoutes.js
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const feedRoutes = require("./routes/feed");
const searchRoutes = require("./routes/search");
const notificationRoutes = require("./routes/notification");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notification", notificationRoutes);

// Health check
app.get("/", (req, res) => {
  res.send({ status: "ok", message: "CodeGram backend is running 🚀" });
});

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}, you accessed a protected route!` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
