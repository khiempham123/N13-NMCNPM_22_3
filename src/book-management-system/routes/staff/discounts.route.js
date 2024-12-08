const express = require("express");
const router = express.Router();
const discountsController = require("../../controllers/staff/discounts.controller");

// Định nghĩa các route và kết nối với controller
router.get("/", discountsController.getAllDiscounts);
router.get("/:id", discountsController.getDiscountById);
router.post("/", discountsController.createDiscount);
router.patch("/:id", discountsController.updateDiscount);
router.delete("/:id", discountsController.deleteDiscount);

module.exports = router;
