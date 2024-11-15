const Book = require("../../models/books.js");

const getCategories = async (req, res) => {
    try {
        // Sử dụng MongoDB aggregation để nhóm theo category và đếm số lượng sách trong từng danh mục
        const categories = await Book.aggregate([
            { $match: { Deleted: false } }, // Lọc các sách chưa bị xóa
            { $group: { _id: "$Category", productCount: { $sum: 1 } } }, // Nhóm theo Category và đếm số lượng
            { 
                $project: {
                    id: "$_id", // Đổi _id thành id để tiện cho frontend
                    name: "$_id", // Đổi _id thành name (tên danh mục)
                    productCount: 1,
                    _id: 0 // Loại bỏ _id gốc
                }
            }
        ]);

        // Trả về danh sách categories dưới dạng JSON
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "An error occurred while fetching categories." });
    }
};

const getBooksByCategory = async (req, res) => {
    const category = req.params.category; // Lấy category từ URL
    try {
        // Tìm các sách thuộc category cụ thể và chưa bị xóa
        const books = await Book.find({ Category: category, Deleted: false });
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books by category:", error);
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
};
module.exports = {
    getCategories,
    getBooksByCategory,
};