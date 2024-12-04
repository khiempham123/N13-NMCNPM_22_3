const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/fav.controller");
const authenticateUser = require("../../middleware/authenticateUser");

router.get("/get-fav", authenticateUser, controller.getFav);

router.delete(
  "/remove-fav/:itemId",
  authenticateUser,
  controller.removeFavItem
);

module.exports = router;
