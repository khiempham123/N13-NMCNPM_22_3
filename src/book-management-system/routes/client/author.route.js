const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/author.controller");

router.get("/:id", controller.getAuthorById);

router.get("/", controller.getAllAuthors);

module.exports = router;
