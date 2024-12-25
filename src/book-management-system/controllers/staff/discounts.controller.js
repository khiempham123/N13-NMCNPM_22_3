const Book = require('../../models/books');
const Discount=require('../../models/discounts')
const mongoose = require('mongoose');

module.exports.sales = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Lấy tham số page và limit từ query
    const skip = (page - 1) * limit;

    // Lấy danh sách sách đang được giảm giá với phân trang
    const discountedBooks = await Book.find({ percentDiscount: { $gt: 0 }, deleted: false })
      .skip(skip)
      .limit(Number(limit));

    const totalBooks = await Book.countDocuments({ percentDiscount: { $gt: 0 }, deleted: false });

    res.status(200).json({
      books: discountedBooks,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};

module.exports.index = async (req, res) => {

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch book', error });
      }


}
module.exports.update = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
      } catch (error) {
        res.status(500).json({ message: 'Failed to update book', error });
      }



}

module.exports.delete = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete book', error });
      }


}
module.exports.deleteDiscount = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    // Cập nhật percentDiscount về 0 trong Book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { percentDiscount: 0 },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Tìm và xóa Discount liên quan đến Book
    const deletedDiscount = await Discount.findOneAndDelete({ bookId });

    if (!deletedDiscount) {
      return res.status(404).json({ message: 'Discount not found for this book' });
    }

    res.status(200).json({
      message: 'Discount deleted and book updated successfully',
      updatedBook,
    });
  } catch (error) {
    console.error('Failed to delete discount and update book:', error);
    res.status(500).json({ message: 'Failed to delete discount and update book', error });
  }
};

module.exports.getDiscount = async (req, res) => {
    try {
        console.log(req.params.id)
        const discount = await Discount.findOne({ bookId: req.params.id }).populate('bookId'); 

        if (!discount) {
          return res.status(404).json({ message: 'Discount not found' });
        }
        res.status(200).json(discount);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching discount', error });
      }

}
module.exports.updateDiscount = async (req, res) => {
  const bookId = req.params.id; // ID của sách (bookId)
  const discountData = req.body;

  try {
    // Tìm Discount liên quan đến bookId
    const existingDiscount = await Discount.findOne({ bookId });

    if (!existingDiscount) {
      return res.status(404).json({ message: 'Discount not found for this book' });
    }

    // Cập nhật Discount
    const updatedDiscount = await Discount.findByIdAndUpdate(
      existingDiscount._id,
      discountData,
      { new: true, runValidators: true }
    );

    // Cập nhật Book liên quan
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        percentDiscount: discountData.discountPercentage,
        price: discountData.originalPrice,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Trả về phản hồi
    res.status(200).json({
      message: 'Discount and book updated successfully',
      updatedDiscount,
      updatedBook,
    });
  } catch (error) {
    console.error('Failed to update discount and book:', error);
    res.status(500).json({ message: 'Failed to update discount and book', error });
  }
};


module.exports.createDiscount = async (req, res) => {
  try {
    const {
      bookId, // ID của sách
      discountPrice,
      discountPercent,
      soldCount,
      maxQuantity,
      description,
      startDate, // Lấy startDate từ request body
      endDate, // Lấy endDate từ request body
    } = req.body;

    // Tìm sách theo bookId
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Cập nhật discountPercent trong model Book
    book.percentDiscount = discountPercent;
    await book.save();

    // Tạo mới bản ghi trong model Discount
    const discount = new Discount({
      bookId, // Tham chiếu đến sách
      discountPrice,
      originalPrice: book.price, // Giá gốc từ Book
      discountPercentage: discountPercent,
      startDate, // Sử dụng giá trị từ request body
      endDate, // Sử dụng giá trị từ request body
      dealActive: true,
      soldCount,
      maxQuantity,
      dealDescription: description,
    });

    await discount.save();

    res.status(201).json({ message: 'Discount created successfully', discount });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ message: 'Failed to create discount', error });
  }
};

  