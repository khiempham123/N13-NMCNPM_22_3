const express = require("express");
const router = express.Router();
const authRouter =require("../../controllers/staff/auth.controller")



router.post("/verify-token",authRouter.verifyToken)
module.exports = router;