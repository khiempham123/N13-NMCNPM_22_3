const express = require("express");
const router = express.Router();
const booksController = require("../../controllers/staff/books.controller");

router.get("/", booksController.getAllBooks);
router.post("/", booksController.createBook);
router.patch("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

module.exports = router;
