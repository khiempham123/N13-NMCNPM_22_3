const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/home.controller'); 

router.get("/categories", controller.getCategories);
router.get("/categories/:category", controller.getBooksByCategory);
router.get("/search", controller.getFilteredBooks);


router.get("/shop", controller.getShopPage);
router.get("/authors", controller.getAuthors);
router.get("/blog", controller.getBlog);
router.get("/contact", controller.getContact);

// top category
router.get('/top-categories', controller.getTopCategories);
module.exports= router;



//   123456