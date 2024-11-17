const Book = require("../../models/books.js");

// Hàm lấy danh sách các danh mục sách
const getCategories = async (req, res) => {
    try {
        const categories = await Book.aggregate([
            { $match: { Deleted: false } },
            { $group: { _id: "$Category", productCount: { $sum: 1 } } },
            { 
                $project: {
                    id: "$_id",
                    name: "$_id",
                    productCount: 1,
                    _id: 0
                }
            }
        ]);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "An error occurred while fetching categories." });
    }
};

// Hàm lấy sách theo danh mục
const getBooksByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const books = await Book.find({ Category: category, Deleted: false });
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books by category:", error);
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
};

// Hàm lọc sách theo từ khóa và danh mục
const getFilteredBooks = async (req, res) => {
    const { q, category } = req.query;
    try {
        const filter = { Deleted: false };
        if (q) {
            filter.Title = { $regex: q, $options: "i" };
        }
        if (category) {
            filter.Category = category;
        }

        // Chọn các trường cần thiết, bao gồm Author thay vì Authors
        const books = await Book.find(filter).select("Title Author Category Thumbnail Price _id");
        res.status(200).json(books);
    } catch (error) {
        console.error("Error filtering books:", error);
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
};

// Hàm lấy tất cả sách cho trang shop
const getShopPage = async (req, res) => {
    try {
        const books = await Book.find({ Deleted: false });
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books for shop page:", error);
        res.status(500).json({ message: "An error occurred while fetching books for shop page." });
    }
};

// Hàm lấy danh sách tác giả
const getAuthors = async (req, res) => {
    try {
        // Sử dụng trường Author thay vì Authors
        const authors = await Book.distinct("Author", { Deleted: false });
        res.status(200).json(authors.map(author => ({ name: author })));
    } catch (error) {
        console.error("Error fetching authors:", error);
        res.status(500).json({ message: "An error occurred while fetching authors." });
    }
};

// Hàm lấy blog (không thay đổi)
const getBlog = async (req, res) => {
    try {
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

// Hàm lấy thông tin liên hệ (không thay đổi)
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

// Hàm lấy danh mục bán chạy nhất
const getTopCategories = async (req, res) => {
    try {
        const categories = await Book.aggregate([
            { $match: { Deleted: false } },
            { $group: { _id: "$Category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching top categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// start deals of the week

const Discount = require("../../models/discounts.js");
// 123
// Function to get Deals of the Week
const getDealsOfTheWeek = async (req, res) => {
    try {
        const currentDate = new Date();

        const deals = await Discount.find({
            dealActive: true,
            $expr: {
                $and: [
                    { $lte: [{ $toDate: "$startDate" }, currentDate] },
                    { $gte: [{ $toDate: "$endDate" }, currentDate] }
                ]
            }
        })
        .populate({
            path: 'bookId',
            select: 'Title Author Thumbnail' 
        })
        .sort({ dealRank: 1 }) 
        .limit(4);

        if (!deals || deals.length === 0) {
            return res.status(404).json({ message: "No active deals found for the week." });
        }

        const dealsResponse = deals.map(deal => {
            if (!deal.bookId) {
                console.warn(`Book not found for deal ID: ${deal._id}`);
                return null;
            }

            return {
                _id: deal.bookId._id,
                title: deal.bookId.Title,
                author: deal.bookId.Author, 
                thumbnail: deal.bookId.Thumbnail, 
                discountPrice: deal.discountPrice,
                originalPrice: deal.originalPrice,
                soldCount: deal.soldCount,
                maxQuantity: deal.maxQuantity,
                dealDescription: deal.dealDescription,
                endDate: deal.endDate
            };
        }).filter(deal => deal !== null); 

        res.status(200).json(dealsResponse);
    } catch (error) {
        console.error("Error fetching deals of the week:", error);
        res.status(500).json({ message: "An error occurred while fetching deals of the week." });
    }
};




// end deals of the week


module.exports = {
    getCategories,
    getBooksByCategory,
    getFilteredBooks,
    getShopPage,
    getAuthors,
    getBlog,
    getContact,
    getTopCategories,
    getDealsOfTheWeek,
};





// 123456