const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { likePost, dislikePost } = require('../controllers/likeController');

router.post("/like/:postId", authMiddleware.protect, likePost);
router.post("/dislike/:postId", authMiddleware.protect, dislikePost);

module.exports = router;