const Book = require("../../models/books");

// Hàm lấy danh sách sách với phân trang
const getAllBooks = async (req, res) => {
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


// Thêm mới một sách
const createBook = async (req, res) => {
    const { title, author, price, stock, category, publisher, publishDate } = req.body;
    try {
        const newBook = new Book({
            title,
            author,
            price,
            stock,
            category,
            publisher,
            publishDate,
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: "Error adding book" });
    }
};

// Cập nhật một sách bằng phương thức PATCH (chỉ cập nhật các trường cần thiết)
const updateBook = async (req, res) => {
    try {
        // Tìm sách theo ID
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Cập nhật các trường của sách với dữ liệu mới
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // Trả về sách đã được cập nhật
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Error updating book" });
    }
};

// Xóa sách (soft delete)
const deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(deletedBook);
    } catch (error) {
        res.status(500).json({ message: "Error deleting book" });
    }
};

module.exports = {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
};
