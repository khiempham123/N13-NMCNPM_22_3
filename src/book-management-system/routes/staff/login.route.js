
const express = require('express')
const router = express.Router();

const controller = require('../../controllers/staff/staff.controller');

router.post("/login", controller.login);
router.put('/change-password', controller.changePassword); 
router.post('/logout',controller.logout)


module.exports = router;

