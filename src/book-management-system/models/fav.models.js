const mongoose = require("mongoose");

const favItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    thumbnail: { type: String },
    author: { type: String },
    title: { type: String },
    rating: { type: Number },
    price: { type: Number },
  },
  { timestamps: true }
);

const favSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [favItemSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", favSchema);
