const Book = require("../../models/books.js");
const mongoose = require("mongoose");

// Controller to get book details by ID
const getBookDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const book = await Book.findById(id);

    // Check if the book exists
    if (!book || book.deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// end controller trả API thông tin sản phẩm /detail/:id

// Start controller trả thông tin các sản phẩm có cùng category với sản phẩm detail /related/:id

const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the product by ID
    const book = await Book.findById(id);

    // Check if the product exists
    if (!book || book.deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find 6 random related products in the same category
    const relatedProducts = await Book.aggregate([
      {
        $match: {
          category: book.category, // Match category
          _id: { $ne: book._id }, // Exclude the current product
          deleted: false, // Ensure the product is not deleted
        },
      },
      { $sample: { size: 6 } }, // Get 6 random products
    ]);

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// End controller trả thông tin các sản phẩm có cùng category với sản phẩm detail /related/:id

module.exports = {
  getBookDetailById,
  getRelatedProducts,
};
