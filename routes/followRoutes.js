const express = require('express');
const router = express.Router();
const {
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
} = require("../controllers/followController");

// Follow routes
router.get("/followers/:userId", getFollowers);

router.get("/following/:userId", getFollowing);

router.post("/follow/:userId", followUser);

router.delete("/unfollow/:userId", unfollowUser);

module.exports = router;