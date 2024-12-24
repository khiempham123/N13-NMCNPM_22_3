const express = require("express");
const router = express.Router();
const authRouter =require("../../controllers/staff/auth.controller")



router.post("/verify-token",authRouter.verifyToken)
router.post("/refresh-token",authRouter.refreshToken)
module.exports = router;