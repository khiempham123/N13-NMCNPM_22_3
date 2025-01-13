const Author = require("../../models/authors.models.js");

const getAuthorById = async (req, res) => {
  try {
    const authorId = req.params.id;

    const author = await Author.findById(authorId).populate("books");

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = parseInt(req.query.limit) || 8; // Số lượng item mỗi trang, mặc định là 10
    const skip = (page - 1) * limit;

    const authors = await Author.find()
      .populate("books")
      .skip(skip)
      .limit(limit);

    const totalAuthors = await Author.countDocuments(); // Tổng số tác giả
    const totalPages = Math.ceil(totalAuthors / limit);

    return res.status(200).json({
      authors,
      totalPages,
      currentPage: page,
      totalAuthors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAuthorById,
  getAllAuthors,
};
