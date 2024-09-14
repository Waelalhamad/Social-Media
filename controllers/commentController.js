const Comment = require("../models/Comment");
const Post = require("../models/Post");


exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .send({ status: "fail", message: "Post not found!" });
    }

    const comment = await Comment.create({
      text: req.body.text,
      post: req.params.postId,
      user: req.user.id, // assuming req.user contains the authenticated user's id
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).send({ status: "success", data: comment });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("comments");

    if (!post) {
      return res
        .status(404)
        .send({ status: "fail", message: "Post not found!" });
    }

    res.status(200).send({
      status: "success",
      result: post.comments.length,
      data: post.comments,
    });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text: req.body.text },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res
        .status(404)
        .send({ status: "fail", message: "Comment not found!" });
    }

    res.status(200).send({ status: "success", data: comment });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);

    if (!comment) {
      return res
        .status(404)
        .send({ status: "fail", message: "Comment not found!" });
    }

    // Remove the comment from the post's comment array
    const post = await Post.findById(req.params.postId);
    post.comments = post.comments.filter(
      (commentId) => commentId.toString() !== req.params.commentId
    );
    await post.save();

    res.status(200).send({
      status: "success",
      message: "Comment deleted successfully!",
    });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};
