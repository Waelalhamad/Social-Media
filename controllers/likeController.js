const Like = require("../models/Like");
const Dislike = require("../models/Dislike");

exports.likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    // Check if user liked the post
    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      // If liked remove the like
      await Like.findOneAndDelete({ post: postId, user: userId });
      return res
        .status(200)
        .json({ status: "success", message: "Like removed successfully!" });
    }

    // Remove the dislike
    await Dislike.findOneAndDelete({ post: postId, user: userId });

    // Like
    const newLike = new Like({ post: postId, user: userId });
    await newLike.save();

    return res
      .status(201)
      .json({ status: "success", message: "Post liked successfully." });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.dislikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const existingDislike = await Dislike.findOne({
      post: postId,
      user: userId,
    });

    if (existingDislike) {
      await Dislike.findOneAndDelete({ post: postId, user: userId });
      return res
        .status(200)
        .json({ status: "success", message: "Dislike removed successfully." });
    }

    await Like.findOneAndDelete({ post: postId, user: userId });

    const newDislike = new Dislike({ post: postId, user: userId });
    await newDislike.save();

    return res.status(201).json({ message: "Post disliked successfully." });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
