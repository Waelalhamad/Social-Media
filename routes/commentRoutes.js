const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router({ mergeParams: true }); // mergeParams allows access to :postId from post routes

// Create a new comment
router.post("/", commentController.addComment);

// Get all the comment
router.get("/", commentController.getAllComments);

// Update the comment
router.patch("/:commentId", commentController.updateComment);

// Delete the comment
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;
