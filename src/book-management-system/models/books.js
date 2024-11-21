const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    publisher: { type: String },
    publishDate: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    deleted: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    thumbnail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
