const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/detail.controller'); 

router.get("/:id", controller.getBookDetailById);

router.get("/related/:id", controller.getRelatedProducts);

module.exports= router;
