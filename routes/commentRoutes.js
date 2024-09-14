const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to :postId from post routes

// Create a new comment
router.post("/", authMiddleware.protect, commentController.addComment);

// Get all the comment
router.get("/", commentController.getAllComments);

// Update the comment
router.patch("/:commentId", authMiddleware.protect, commentController.updateComment);

// Delete the comment
router.delete("/:commentId", authMiddleware.protect, commentController.deleteComment);

module.exports = router;
