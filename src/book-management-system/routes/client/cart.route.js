const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const {
  authenticateUser,
  authorize,
} = require("../../middleware/authenticateUser");

router.get(
  "/get-cart",
  authenticateUser,
  authorize(["customer"]),
  controller.getCart
);

router.patch(
  "/update/:itemId",
  authenticateUser,
  authorize(["customer"]),
  controller.updateCartItemQuantity
);

router.delete(
  "/remove/:itemId",
  authenticateUser,
  authorize(["customer"]),
  controller.removeCartItem
);

module.exports = router;
