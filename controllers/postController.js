const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }

    const user = req.user._id;
    if (!caption) {
      return res
        .status(400)
        .json({ status: false, message: "caption is required" });
    }

    const post = new Post({
      user,
      caption,
      image,
    });

    await post.save();

    res.status(201).json({
      status: true,
      message: "Post created successfully",
      Post: post,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "status",
      results: posts.length,
      Posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "username avatar")
      .populate("comments");

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    res.status(200).json({
      status: true,
      post,
      likeCount: post.likeCount,
      dislikeCount: post.dislikeCount,
      commentCount: post.commentCount,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    // Check if the logged-in user is the post owner
    if (post.user.toString() !== req.user.id.toString()) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized action" });
    }

    const { caption, image } = req.body;
    post.caption = caption || post.caption;
    post.image = image || post.image;

    await post.save();

    res.status(200).json({
      status: true,
      message: "Post updated successfully",
      Post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    // Check if the logged-in user is the post owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized action" });
    }

    // Correct way to delete the post
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      status: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
