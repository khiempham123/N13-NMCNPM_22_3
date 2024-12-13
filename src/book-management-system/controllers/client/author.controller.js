const Author = require("../../models/authors.models.js");

// Controller lấy thông tin tác giả theo ID
const getAuthorById = async (req, res) => {
  try {
    // Lấy ID tác giả từ tham số đường dẫn
    const authorId = req.params.id;

    // Tìm tác giả trong cơ sở dữ liệu, bao gồm thông tin sách (populate books)
    const author = await Author.findById(authorId).populate("books");

    // Nếu tác giả không tồn tại
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Trả về thông tin tác giả
    return res.status(200).json(author);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller lấy danh sách tất cả các tác giả
const getAllAuthors = async (req, res) => {
  try {
    // Lấy danh sách tất cả tác giả và bao gồm thông tin sách (populate books)
    const authors = await Author.find().populate("books");

    // Trả về danh sách tác giả
    return res.status(200).json(authors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAuthorById,
  getAllAuthors,
};
