const express = require("express");
const router = express.Router();
const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require("../../controllers/staff/customers.controller");

// Định nghĩa các route và kết nối với controller
// Lấy tất cả khách hàng
router.get("/", getAllCustomers);
// Lấy khách hàng theo ID
router.get("/:id", getCustomerById);
// Thêm mới khách hàng
router.post("/", createCustomer);
// Cập nhật thông tin khách hàng
router.patch("/:id", updateCustomer);
// Xóa khách hàng
router.delete("/:id", deleteCustomer);

module.exports = router;
