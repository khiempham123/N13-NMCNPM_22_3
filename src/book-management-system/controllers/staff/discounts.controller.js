const Book = require('../../models/books');
const Discount=require('../../models/discounts')
const mongoose = require('mongoose');

module.exports.sales = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

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

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { percentDiscount: 0 },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

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
  const bookId = req.params.id;
  const discountData = req.body;

  try {
    const existingDiscount = await Discount.findOne({ bookId });

    if (!existingDiscount) {
      return res.status(404).json({ message: 'Discount not found for this book' });
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      existingDiscount._id,
      discountData,
      { new: true, runValidators: true }
    );

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
      bookId, 
      discountPrice,
      discountPercent,
      soldCount,
      maxQuantity,
      description,
      startDate, 
      endDate, 
    } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.percentDiscount = discountPercent;
    await book.save();

    const discount = new Discount({
      bookId, 
      discountPrice,
      originalPrice: book.price, 
      discountPercentage: discountPercent,
      startDate, 
      endDate, 
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

  