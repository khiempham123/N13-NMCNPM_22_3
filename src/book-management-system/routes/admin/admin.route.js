// routes/admin/admin.route.js
const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/admin.controller");

// Route đăng nhập
router.post("/login", adminController.login);

// Các route cần bảo vệ khác có thể thêm vào đây

module.exports = router;
