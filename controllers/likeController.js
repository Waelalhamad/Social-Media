const Post = require("../models/Post");
const Like = require("../models/Like");
const Dislike = require("../models/Dislike");

exports.likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  if(!userId) {
    return res.status(401).json({ status: "error", message: "User not logged in" });
  }

  try {
    const post = await Post.findById(postId);

    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      await Like.findOneAndDelete({ post: postId, user: userId });
      post.likeCount -= 1;
      await post.save();
      return res
        .status(200)
        .json({ status: "success", message: "Like removed successfully!" });
    }

    await Dislike.findOneAndDelete({ post: postId, user: userId });

    const newLike = new Like({ post: postId, user: userId });
    await newLike.save();
    post.likeCount += 1;
    await post.save();

    res
      .status(201)
      .json({ status: "success", message: "Post liked successfully." });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.dislikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    const existingDislike = await Dislike.findOne({
      post: postId,
      user: userId,
    });

    if (existingDislike) {
      await Dislike.findOneAndDelete({ post: postId, user: userId });
      post.dislikeCount -= 1;
      await post.save();
      return res
        .status(200)
        .json({ status: "success", message: "Dislike removed successfully." });
    }

    await Like.findOneAndDelete({ post: postId, user: userId });

    const newDislike = new Dislike({ post: postId, user: userId });
    await newDislike.save();
    post.dislikeCount += 1;
    await post.save();

    res.status(201).json({ message: "Post disliked successfully." });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
