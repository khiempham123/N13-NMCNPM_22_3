const express = require('express');
const { changePassword } = require('../../controllers/staff/auth.controller');
const router = express.Router();

// Định nghĩa các route và kết nối với controller
// Đổi mật khẩu
router.patch('/', changePassword); 

module.exports = router;