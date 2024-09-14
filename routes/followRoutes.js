const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
} = require("../controllers/followController");

// Follow routes
router.get("/followers/:userId", getFollowers);

router.get("/following/:userId", getFollowing);

router.post("/follow/:userId", authMiddleware.protect, followUser);

router.delete("/unfollow/:userId", authMiddleware.protect, unfollowUser);

module.exports = router;