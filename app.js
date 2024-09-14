require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
const app = express();

// Import routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const followRoutes = require("./routes/followRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectionString =
  process.env.CONNECTION_STRING || "mongodb://127.0.0.1:27017/social-media";

async function dbConnect() {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to database");
  } catch (error) {
    console.log(error.message);
  }
}

dbConnect();

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", followRoutes);
app.use("/api/v1/posts/:postId/comments", commentRoutes);
app.use("/api/v1/", likeRoutes);

// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
