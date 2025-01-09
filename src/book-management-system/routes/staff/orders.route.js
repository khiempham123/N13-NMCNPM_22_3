const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrder,
} = require("../../controllers/staff/orders.controller");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);
router.put("/:id", updateOrder);

module.exports = router;
