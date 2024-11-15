const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/home.controller'); 

router.get("/categories", controller.getCategories);
router.get("/categories/:category", controller.getBooksByCategory);

module.exports= router;