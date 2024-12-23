const express = require("express");
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, deleteOrder, updateOrder } = require("../../controllers/staff/orders.controller");

// Định nghĩa các route và kết nối với controller
// Lấy tất cả đơn hàng
router.get("/", getAllOrders);
// Lấy đơn hàng theo ID
router.get("/:id", getOrderById);
// Thêm đơn hàng mới
router.post("/", createOrder);
// Xóa đơn hàng
router.delete("/:id", deleteOrder);
// Cập nhật trạng thái đơn hàng
router.put("/:id", updateOrder);

module.exports = router