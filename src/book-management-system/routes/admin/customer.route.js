const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/customer.controller");
const { getVisitorsByPage } = require("../../controllers/admin/visitor.controller");
router.get("/", controller.getAllCustomers);

//router.get("/:id", controller.getCustomerById);

// Route reset mật khẩu khách hàng
router.post("/:id/reset-password", controller.resetCustomerPassword);

// Route xóa tài khoản khách hàng
router.delete("/:id/delete", controller.deleteCustomerAccount);
router.get("/visitors", getVisitorsByPage);

module.exports = router;
