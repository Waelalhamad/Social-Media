const express = require('express');
const router = express.Router();

const { likePost, dislikePost } = require('../controllers/likeController');

router.post("/like/:postId", likePost);
router.post("/dislike/:postId", dislikePost);

module.exports = router;