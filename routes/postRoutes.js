const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
} = require("../controllers/postController");

router.get("/posts", getAllPosts);
router.get("/posts/:postId", getPostById);
router.post("/posts", authMiddleware.protect, createPost);
router.delete("/posts/:postId", authMiddleware.protect, deletePost);
router.patch("/posts/:postId", authMiddleware.protect, updatePost);

module.exports = router;