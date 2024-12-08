const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    BirthDay: { type: Date, required: true },
    Email: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
