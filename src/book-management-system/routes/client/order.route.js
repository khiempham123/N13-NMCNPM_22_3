const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
const authenticateUser = require("../../middleware/authenticateUser");

router.get("/", authenticateUser, controller.getOrders);
router.get("/order-counts", authenticateUser, controller.getOrderCounts);

router.post("/", authenticateUser, controller.createOrder);

router.delete("/:orderId", authenticateUser, controller.deleteOrder);

module.exports = router;