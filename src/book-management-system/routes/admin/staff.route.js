const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/staff.controller");

router.post("/add", controller.addStaff);

// Route lấy danh sách tất cả staff
router.get("/", controller.getAllStaffs);

// Route xóa staff
router.delete("/:id", controller.deleteStaff);

// Route sửa thông tin staff
router.put("/:id", controller.updateStaff);
router.get("/:id", controller.getStaff);
module.exports = router;
