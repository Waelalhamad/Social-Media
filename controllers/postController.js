const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const user = req.user._id;
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const post = new Post({
      user,
      content,
      image,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      Post: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: posts.length,
      Posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "user",
      "username avatar"
    );
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the logged-in user is the post owner
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action" });
    }

    const { content, image } = req.body;
    post.content = content || post.content;
    post.image = image || post.image;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the logged-in user is the post owner
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action" });
    }

    await post.remove();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
