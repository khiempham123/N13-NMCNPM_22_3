const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
