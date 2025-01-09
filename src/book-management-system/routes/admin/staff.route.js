const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/staff.controller");

router.post("/add", controller.addStaff);

router.get("/", controller.getAllStaffs);

router.delete("/:id", controller.deleteStaff);

router.put("/:id", controller.updateStaff);
router.get("/:id", controller.getStaff);
module.exports = router;
