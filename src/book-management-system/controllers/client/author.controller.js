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
    const authors = await Author.find().populate("books");
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
