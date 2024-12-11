const Book = require("../../models/books");
const mongoose = require("mongoose");

// GET /book
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const books = await Book.find({}).skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

// GET //book/search
module.exports.search = async (req, res) => {
  try {
    const { author, genre, minPrice, maxPrice, page, sort } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit || 0;
    const filters = {};

    // Xử lý tác giả
    if (author) {
      const authorList = author.split(",").map((a) => a.replace(/\+/g, " "));
      filters.author = { $in: authorList };
    }

    // Xử lý thể loại
    if (genre) {
      const genreList = genre.split(",").map((g) => g.replace(/\+/g, " "));
      filters.category = { $in: genreList };
    }

    // Xử lý giá
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Thiết lập sort
    let sortOptions = {};
    if (sort) {
      if (sort === "Sort by price (Ascending)") {
        sortOptions.price = 1; // Sắp xếp tăng dần theo giá
      } else if (sort === "Sort by price (Descending)") {
        sortOptions.price = -1; // Sắp xếp giảm dần theo giá
      }
    }

    // Tìm kiếm và phân trang
    const books = await Book.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions); // Áp dụng sắp xếp
    const totalBooks = await Book.countDocuments(filters); // Đếm tổng số sách thỏa mãn điều kiện

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", error });
  }
};
