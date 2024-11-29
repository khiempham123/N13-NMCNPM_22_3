const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    publisher: { type: String },
    publishDate: { type: String },
    price: { type: Number, required: true },
    percentDiscount: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    bestSeller: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
