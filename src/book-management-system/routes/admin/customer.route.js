const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/customer.controller");
const { getVisitorsByPage } = require("../../controllers/admin/visitor.controller");
router.get("/", controller.getAllCustomers);

router.post("/:id/reset-password", controller.resetCustomerPassword);

router.delete("/:id/delete", controller.deleteCustomerAccount);
router.get("/visitors", getVisitorsByPage);

module.exports = router;
