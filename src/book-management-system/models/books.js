const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Authors: { type: String, required: true },
    Description: { type: String },
    Category: { type: String },
    Publisher: { type: String },
    'Publish Date': { type: Date },
    Price: { type: Number, required: true },
    Deleted: { type: Boolean, default: false },
    best_seller: { type: Boolean, default: false },
    Thumbnail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
