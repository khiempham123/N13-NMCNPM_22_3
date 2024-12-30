const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/home.controller");

const { authenticateUser, authorize } = require("../../middleware/authenticateUser");

router.get("/categories", controller.getCategories);
router.get("/categories/:category", controller.getBooksByCategory);
router.get("/search", controller.getFilteredBooks);

// top category
router.get("/top-categories", controller.getTopCategories);

// start deals of the week

router.get("/deals-of-the-week", controller.getDealsOfTheWeek);

// end deals of the week

router.get("/best-seller", controller.getBestSeller);

router.post("/add-to-cart", authenticateUser,authorize(["customer"]), controller.addBookToCart);

router.post("/add-to-fav", authenticateUser,authorize(["customer"]), controller.addBookToFav);

router.get("/authors", controller.getAuthors);

module.exports = router;

//   123456
