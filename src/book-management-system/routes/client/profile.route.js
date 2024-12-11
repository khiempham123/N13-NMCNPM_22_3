const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/profile.controller");
const authenticateUser = require("../../middleware/authenticateUser");

router.get("/get-info", authenticateUser, controller.getInfo);

router.put("/edit-info", authenticateUser, controller.editInfo);

module.exports = router;
