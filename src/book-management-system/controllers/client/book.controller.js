const Book = require("../../models/books");
const mongoose = require("mongoose");

// GET /book
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;


    const books = await Book.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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



module.exports.update = async (req, res) => {
  try {
    const bookId = req.params.id; // Lấy ID từ URL
    const updatedData = req.body; // Lấy dữ liệu mới từ request body

    // Tìm sách theo ID và cập nhật
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true, // Trả về dữ liệu sau khi cập nhật
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json({
      message: "Book updated successfully!",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error: error.message });
  }


}

module.exports.delete = async (req, res) => {
  try {
    const bookId = req.params.id; // Lấy ID sách từ URL
    console.log(bookId)
    const deletedBook = await Book.findByIdAndDelete(bookId); // Xóa sách theo ID

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" }); // Nếu không tìm thấy sách
    }

    res.status(200).json({ message: "Book deleted successfully", data: deletedBook });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }


}
module.exports.add = async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      publisher: req.body.publisher,
      publishDate: req.body.publishDate,
      thumbnail: req.body.thumbnail,
      description: req.body.description,
    });

    const savedBook = await newBook.save();
    res.status(201).json({ message: "Book added successfully", data: savedBook });
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message });
  }

}

