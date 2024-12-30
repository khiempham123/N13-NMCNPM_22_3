const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
const { authenticateUser, authorize } = require("../../middleware/authenticateUser");

router.get("/", authenticateUser, controller.getOrders);
router.get('/count', controller.countOrders);
router.get('/total-shipped',controller.totalShiped)
router.get("/order-counts", authenticateUser,authorize(["customer"]), controller.getOrderCounts);

router.post("/", authenticateUser,authorize(["customer"]), controller.createOrder);

router.delete("/:orderId", authenticateUser,authorize(["customer"]), controller.deleteOrder);

module.exports = router;

