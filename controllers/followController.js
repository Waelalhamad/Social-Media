const User = require("../models/User");

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res
        .status(404)
        .send({ status: "fail", message: "User not found!" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .send({ status: "fail", message: "Already following this user!" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).send({
      status: "success",
      message: `Now following ${userToFollow.username}`,
    });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res
        .status(404)
        .send({ status: "fail", message: "User not found!" });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res
        .status(400)
        .send({ status: "fail", message: "You are not following this user!" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).send({
      status: "success",
      message: `Unfollowed ${userToUnfollow.username}`,
    });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "followers",
      "username avatar"
    );
    if (!user) {
      return res
        .status(404)
        .send({ status: "fail", message: "User not found!" });
    }
    res.status(200).send({ status: "success", data: user.followers });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "following",
      "username avatar"
    );
    if (!user) {
      return res
        .status(404)
        .send({ status: "fail", message: "User not found!" });
    }
    res.status(200).send({ status: "success", data: user.following });
  } catch (error) {
    res.status(500).send({ status: "fail", message: error.message });
  }
};
