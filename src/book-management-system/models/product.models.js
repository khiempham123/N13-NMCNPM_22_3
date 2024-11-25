const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
    },
    publish_date: {
        type: Date,
    },
    price: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    best_seller: {
        type: Boolean,
        default: false
    },
    thumbnail: {
        type: String,
    },
}, { 
    timestamps: true, 
    collection: 'products' 
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
