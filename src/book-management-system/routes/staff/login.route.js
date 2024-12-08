const express = require("express");
const { loginUser  } = require("../../controllers/staff/auth.controller");
const router = express.Router();

// Định nghĩa các route và kết nối với controller
// Đăng nhập người dùng
router.post("/", loginUser );

module.exports = router;