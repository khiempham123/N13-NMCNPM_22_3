const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/fav.controller");
const { authenticateUser, authorize } = require("../../middleware/authenticateUser");

router.get("/get-fav", authenticateUser,authorize(["customer"]), controller.getFav);

router.delete(
  "/remove-fav/:itemId",
  authenticateUser,authorize(["customer"]),
  controller.removeFavItem
);

module.exports = router;
