const express = require("express");
const router = express.Router();
const discountsController = require("../../controllers/staff/discounts.controller");

router.get("/", discountsController.sales);
router.get("/:id", discountsController.index);
router.get("/discount/:id", discountsController.getDiscount);
router.put("/discount/:id", discountsController.updateDiscount);
router.put("/:id", discountsController.update);
router.delete("/:id", discountsController.deleteDiscount);
router.post("/add", discountsController.createDiscount);
module.exports = router;
