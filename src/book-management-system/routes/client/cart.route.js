const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const { authenticateUser, authorize } = require("../../middleware/authenticateUser");

// tham san phan vao gio hang

router.get("/get-cart", authenticateUser,authorize(["customer"]), controller.getCart); // Route lấy giỏ hàng

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.patch(
  "/update/:itemId",
  authenticateUser,authorize(["customer"]),
  controller.updateCartItemQuantity
);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove/:itemId", authenticateUser,authorize(["customer"]), controller.removeCartItem);

module.exports = router;
