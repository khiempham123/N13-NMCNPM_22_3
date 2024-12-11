const Book = require("../../models/books");

// Hàm lấy danh sách sách với phân trang
const getAllBooks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Lấy số trang và số lượng sách mỗi trang từ query params
    const skip = (page - 1) * limit; // Tính toán số lượng sách cần bỏ qua

    try {
        const books = await Book.find({ deleted: false })
            .skip(skip)
            .limit(limit);
        const totalBooks = await Book.countDocuments({ deleted: false }); // Tổng số sách

        res.status(200).json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books,
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
};
// Lấy sách theo ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book" });
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
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};
