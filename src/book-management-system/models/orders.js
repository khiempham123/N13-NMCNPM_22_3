const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Address: { type: String, required: true },
    Total: { type: String, required: true },
    Status: {
        type: String,
        required: true,
        enum: ['order received', 'processing', 'packed', 'shipped'],
        default: 'order received'
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
