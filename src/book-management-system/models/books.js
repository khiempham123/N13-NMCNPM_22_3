const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    publisher: { type: String },
    publishDate: { type: Date }, 
    price: { type: Number, required: true },
    percentDiscount: { type: Number, default: 0, required: false }, 
    rating: { type: Number, default: 0, required: false },
    stock: { type: Number, required: true },
    bestSeller: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    thumbnail: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); 
        },
        message: "Invalid URL format for thumbnail",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);