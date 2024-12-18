const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/customer.controller");

router.get("/", controller.getAllCustomers);

router.get("/:id", controller.getCustomerById);

// Route reset mật khẩu khách hàng
router.post("/:id/reset-password", controller.resetCustomerPassword);

// Route xóa tài khoản khách hàng
router.delete("/:id/delete", controller.deleteCustomerAccount);

module.exports = router;
