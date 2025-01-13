const Book = require("../../models/books.js");
const Discount = require("../../models/discounts.js");
const Cart = require("../../models/cart.models.js");
const Favorite = require("../../models/fav.models.js");

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

const getBestSeller = async (req, res) => {
  try {
    const books = await Book.find({ deleted: false, bestSeller: true })
      .limit(8)
      .select("title author price percentDiscount rating thumbnail");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách sách",
      error: err.message,
    });
  }
};


const addBookToCart = async (req, res) => {
  const { bookId, title, thumbnail, price, quantity } = req.body;
  const userId = req.user?.id; 
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Sách không tồn tại" });
    }

    if (quantity > book.stock) {
      return res.status(400).json({
        message: "Vượt quá số lượng còn lại",
        availableStock: book.stock,
      });
    }
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.bookId.toString() === bookId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice =
          existingItem.quantity * existingItem.price.toFixed(2);
      } else {
        const newItem = {
          bookId,
          title,
          thumbnail,
          price,
          quantity,
          totalPrice: price * quantity,
        };
        cart.items.push(newItem);
      }

      cart.totalAmount = cart.items
        .reduce((total, item) => total + item.totalPrice, 0)
        .toFixed(2);

      await cart.save();
      return res.status(200).json({ message: "Giỏ hàng đã được cập nhật" });
    } else {
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
        totalAmount: newItem.totalPrice, 
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

const addBookToFav = async (req, res) => {
  const { bookId, title, thumbnail, price, rating } = req.body;
  const userId = req.user.id; 

  try {
    let fav = await Favorite.findOne({ userId });

    if (fav) {
      const existingItem = fav.items.find(
        (item) => item.bookId.toString() === bookId
      );

      if (existingItem) {
        return res
          .status(400)
          .json({ message: "Sách đã có trong danh sách yêu thích" });
      } else {
        const newItem = {
          bookId,
          title,
          thumbnail,
          price,
          rating,
        };
        fav.items.push(newItem);
      }

      await fav.save();
      return res
        .status(200)
        .json({ message: "Sách đã được thêm vào danh sách yêu thích" });
    } else {
      const newItem = {
        bookId,
        title,
        thumbnail,
        price,
        rating,
      };

      const newFav = new Favorite({
        userId,
        items: [newItem],
      });

      await newFav.save();
      return res.status(200).json({
        message: "Danh sách yêu thích đã được tạo và sách đã được thêm vào",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi server khi thêm sách vào danh sách yêu thích" });
  }
};

const Vendor = require("../../models/vendor.models.js");

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("books")
      .exec();

    const vendorsWithBookCount = vendors.map((vendor) => ({
      ...vendor.toObject(),
      bookCount: vendor.books.length,
    }));

    res.status(200).json(vendorsWithBookCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors", error });
  }
};

const getVendorByName = async (req, res) => {
  const { vendorName } = req.params; 

  try {
    const vendor = await Vendor.findOne({
      vendor: new RegExp("^" + vendorName + "$", "i"),
    }).populate("books"); 

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor", error });
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await Book.distinct("author", { deleted: false });
    res.status(200).json(authors.map((author) => ({ name: author })));
  } catch (error) {
    console.error("Error fetching authors:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching authors." });
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
  addBookToFav,
  getAllVendors,
  getVendorByName,
  getAuthors,
};
