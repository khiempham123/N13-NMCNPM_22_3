const express = require("express");
const { registerUser  } = require("../../controllers/staff/auth.controller"); 
const router = express.Router();

// Đăng ký người dùng
router.post("/", registerUser );

module.exports = router;