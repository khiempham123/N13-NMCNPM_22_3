const express = require('express');
const router = express.Router();
const staffController = require('../../controllers/staff/staff.controller');

router.get(
    "/",staffController.getProfile)
router.put("/update",staffController.updateProfile)
module.exports = router;