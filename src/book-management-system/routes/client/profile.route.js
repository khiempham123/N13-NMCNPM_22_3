const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/profile.controller");
const { authenticateUser, authorize } = require("../../middleware/authenticateUser");

router.get("/get-info", authenticateUser,authorize(["customer"]), controller.getInfo);

router.put("/edit-info", authenticateUser,authorize(["customer"]), controller.editInfo);


router.get("/getUser", controller.getUser);
router.put("/update/:id", controller.updateCustomer);
router.delete("/delete/:id",controller.deleteCustomer)
module.exports = router;
