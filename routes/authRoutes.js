const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");

router.post("/auth/register", register);

router.post("/auth/login", login);

router.post("/auth/forgot-password", forgotPassword);

router.post("/auth/reset-password/:token", resetPassword);

router.patch("/auth/update-password", authMiddleware.protect, updatePassword);

module.exports = router;
