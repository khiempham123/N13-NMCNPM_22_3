const Book = require("../../models/books.js");
const mongoose = require("mongoose");

const getBookDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const book = await Book.findById(id);

    if (!book || book.deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const book = await Book.findById(id);

    if (!book || book.deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    const relatedProducts = await Book.aggregate([
      {
        $match: {
          author: book.author,
          category: book.category,
          _id: { $ne: book._id },
          deleted: false,
        },
      },
      { $sample: { size: 4 } },
    ]);

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getBookDetailById,
  getRelatedProducts,
};
