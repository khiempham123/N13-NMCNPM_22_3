const Book = require("../../models/books");
const mongoose = require("mongoose");

// GET /api/products
module.exports.index = async (req, res) => {
    try {
      // Lấy giá trị `page` và `limit` từ query parameters
      const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
      const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 sản phẩm mỗi trang
      const skip = (page - 1) * limit;
  
      // Thêm các bộ lọc (nếu cần, có thể mở rộng)
      const filters = {};
      if (req.query.category) {
        filters.category = req.query.category;
      }
  
      // Tìm các sản phẩm theo bộ lọc, phân trang
      const books = await Book.find(filters).skip(skip).limit(limit);
      const totalBooks = await Book.countDocuments(filters); // Tổng số sản phẩm
  
      res.json({
        books,
        totalPages: Math.ceil(totalBooks / limit), // Tổng số trang
        currentPage: page, // Trang hiện tại
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(500).json({ message: "Error retrieving products", error });
    }
  };