const Book = require("../../models/books.js");
const Discount = require("../../models/discounts.js");
const User = require("../../models/user.models.js");

// Hàm lấy danh sách các danh mục sách
const getCategories = async (req, res) => {
  try {
    const categories = await Book.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$category", productCount: { $sum: 1 } } },
      {
        $project: {
          id: "$_id",
          name: "$_id",
          productCount: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching categories." });
  }
};

// Hàm lấy sách theo danh mục
const getBooksByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const books = await Book.find({ category, deleted: false });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books by category:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching books." });
  }
};

// Hàm lọc sách theo từ khóa và danh mục
const getFilteredBooks = async (req, res) => {
  const { q, category } = req.query;
  try {
    const filter = { deleted: false };
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }

    const books = await Book.find(filter).select(
      "title author category thumbnail price _id"
    );
    res.status(200).json(books);
  } catch (error) {
    console.error("Error filtering books:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching books." });
  }
};

// Hàm lấy danh mục bán chạy nhất
const getTopCategories = async (req, res) => {
  try {
    const categories = await Book.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching top categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Hàm lấy các khuyến mãi trong tuần
const getDealsOfTheWeek = async (req, res) => {
  try {
    const currentDate = new Date();

    const deals = await Discount.find({
      dealActive: true,
      $expr: {
        $and: [
          { $lte: [{ $toDate: "$startDate" }, currentDate] },
          { $gte: [{ $toDate: "$endDate" }, currentDate] },
        ],
      },
    })
      .populate({
        path: "bookId",
        select: "title author thumbnail",
      })
      .sort({ dealRank: 1 })
      .limit(4);

    if (!deals || deals.length === 0) {
      return res
        .status(404)
        .json({ message: "No active deals found for the week." });
    }

    const dealsResponse = deals
      .map((deal) => {
        if (!deal.bookId) {
          console.warn(`Book not found for deal ID: ${deal._id}`);
          return null;
        }

        return {
          _id: deal.bookId._id,
          title: deal.bookId.title,
          author: deal.bookId.author,
          thumbnail: deal.bookId.thumbnail,
          discountPrice: deal.discountPrice,
          originalPrice: deal.originalPrice,
          soldCount: deal.soldCount,
          maxQuantity: deal.maxQuantity,
          dealDescription: deal.dealDescription,
          endDate: deal.endDate,
        };
      })
      .filter((deal) => deal !== null);

    res.status(200).json(dealsResponse);
  } catch (error) {
    console.error("Error fetching deals of the week:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching deals of the week." });
  }
};

// phần sách
const getBestSeller = async (req, res) => {
  try {
    const books = await Book.find({ deleted: false, bestSeller: true })
      .limit(8)
      .select("title author price percentDiscount rating thumbnail");
    // Trả về danh sách sách với thông tin cần thiết
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách sách",
      error: err.message,
    });
  }
};

// them san pham best seller vào giỏ hàng

const addBookToCart = async (req, res) => {
  const { bookId, title, thumbnail, price, quantity } = req.body;
  const userId = req.user._id; // Giả sử bạn đã có user authentication

  try {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await Cart.findOne({ userId, "items.bookId": bookId });

    if (cartItem) {
      // Nếu có, cập nhật số lượng sản phẩm trong giỏ hàng
      const existingItem = cartItem.items.find(
        (item) => item.bookId.toString() === bookId
      );
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;

      await cartItem.save();
      return res.status(200).json({ message: "Giỏ hàng đã được cập nhật" });
    } else {
      // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
      const newItem = {
        bookId,
        title,
        thumbnail,
        price,
        quantity,
        totalPrice: price * quantity,
      };

      const newCart = new Cart({
        userId,
        items: [newItem],
      });

      await newCart.save();
      return res
        .status(201)
        .json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng." });
  }
};

module.exports = {
  getCategories,
  getBooksByCategory,
  getFilteredBooks,
  getTopCategories,
  getDealsOfTheWeek,
  getBestSeller,
  addBookToCart,
};
