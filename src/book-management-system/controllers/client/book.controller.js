const Book = require("../../models/books");
const mongoose = require("mongoose");
const Author = require("../../models/authors.models");

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

module.exports.search = async (req, res) => {
  try {
    const { author, genre, minPrice, maxPrice, page, sort } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit || 0;
    const filters = {};

    if (author) {
      const authorList = author.split(",").map((a) => a.replace(/\+/g, " "));
      filters.author = { $in: authorList };
    }

    if (genre) {
      const genreList = genre.split(",").map((g) => g.replace(/\+/g, " "));
      filters.category = { $in: genreList };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    let sortOptions = {};
    if (sort) {
      if (sort === "Sort by price (Ascending)") {
        sortOptions.price = 1;
      } else if (sort === "Sort by price (Descending)") {
        sortOptions.price = -1;
      }
    }

    const books = await Book.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);
    const totalBooks = await Book.countDocuments(filters);

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
    const bookId = req.params.id;
    const updatedData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json({
      message: "Book updated successfully!",
      data: updatedBook,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update book", error: error.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res
      .status(200)
      .json({ message: "Book deleted successfully", data: deletedBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete book", error: error.message });
  }
};
module.exports.add = async (req, res) => {
  try {
    let author = await Author.findOne({ name: req.body.author });
    if (!author) {
      author = new Author({
        name: req.body.author,
        bio: req.body.bio || "",
        photo: req.body.photo || "",
      });

      await author.save();
    }

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

    author.books.push(savedBook._id);
    await author.save();
    res
      .status(201)
      .json({ message: "Book added successfully", data: savedBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add book", error: error.message });
  }
};
