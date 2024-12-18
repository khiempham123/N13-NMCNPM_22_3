const express = require('express')
const router = express.Router();
const controller = require('../../controllers/admin/admin.controller');

router.post("/login",controller.login)
module.exports= router;