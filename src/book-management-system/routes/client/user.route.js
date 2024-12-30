const express = require("express");
const router = express.Router();
const userController = require("../../controllers/client/user.controller");
const { authenticateUser, authorize } = require("../../middleware/authenticateUser");

router.post("/signup", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOtp);
router.post("/reset-password", userController.resetPassword);
router.post(
  "/change-password",
  authenticateUser,authorize(["customer"]),
  userController.changePassword
);
module.exports = router;
