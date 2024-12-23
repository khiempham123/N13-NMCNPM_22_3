// discounts.js
const mongoose = require('mongoose');

// Schema for Discount
// Schema for Discount
const discountSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the _id of the Book
        ref: 'Book', // Correct model name
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    dealActive: {
        type: Boolean,
        default: true,
    },
    soldCount: {
        type: Number,
        default: 0,
    },
    maxQuantity: {
        type: Number,
        required: true,
    },
    dealDescription: {
        type: String,
        default: '',
    },
    dealRank: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Create model from schema
module.exports = mongoose.model('Discount', discountSchema);