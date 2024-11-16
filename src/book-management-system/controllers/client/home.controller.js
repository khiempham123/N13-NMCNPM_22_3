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

const searchBooks = async (req, res) => {
    const query = req.query.q; // Lấy từ khóa tìm kiếm từ query string
    try {
        const books = await Book.find({
            Title: { $regex: query, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
            Deleted: false
        }).select("Title Authors _id"); // Chỉ lấy các trường cần thiết để hiển thị
        
        // Đảm bảo gán giá trị mặc định cho Author nếu nó không tồn tại
        const booksWithDefaultAuthor = books.map(book => ({
            ...book._doc, // Dùng _doc để lấy dữ liệu thô từ MongoDB
            Authors: book.Authors || "Unknown Author"
        }));
        
        res.status(200).json(booksWithDefaultAuthor); // Trả về danh sách sách
    } catch (error) {
        console.error("Error searching books:", error);
        res.status(500).json({ message: "An error occurred while searching for books." });
    }
};
////////////////// click navbar

const getShopPage = async (req, res) => {
    try {
        const books = await Book.find({ Deleted: false });
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books for shop page:", error);
        res.status(500).json({ message: "An error occurred while fetching books for shop page." });
    }
};

const getAuthors = async (req, res) => {
    try {
        const authors = await Book.distinct("Authors", { Deleted: false });
        res.status(200).json(authors.map(author => ({ name: author })));
    } catch (error) {
        console.error("Error fetching authors:", error);
        res.status(500).json({ message: "An error occurred while fetching authors." });
    }
};

const getBlog = async (req, res) => {
    try {
        // Replace this with actual blog retrieval logic if needed
        const blogs = [
            { title: "Blog Post 1", content: "Content for blog post 1" },
            { title: "Blog Post 2", content: "Content for blog post 2" }
        ];
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "An error occurred while fetching blogs." });
    }
};

const getContact = (req, res) => {
    try {
        const contactInfo = {
            email: "support@bookstore.com",
            phone: "+84 0123456789",
            address: "123 Book Street, City, Country"
        };
        res.status(200).json(contactInfo);
    } catch (error) {
        console.error("Error fetching contact info:", error);
        res.status(500).json({ message: "An error occurred while fetching contact info." });
    }
};

// top seller

const getTopCategories = async (req, res) => {
    try {
        const categories = await Book.aggregate([
            { $match: { Deleted: false } }, // Loại bỏ các sản phẩm đã bị xóa
            { $group: { _id: "$Category", count: { $sum: 1 } } }, // Đếm số lượng sản phẩm theo Category
            { $sort: { count: -1 } }, // Sắp xếp theo số lượng sản phẩm giảm dần
            { $limit: 6 } // Lấy 6 loại Category có nhiều sản phẩm nhất
        ]);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching top categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// end top seller

module.exports = {
    getCategories,
    getBooksByCategory,
    searchBooks,
    getShopPage,
    getAuthors,
    getBlog,
    getContact,
    getTopCategories,
};
