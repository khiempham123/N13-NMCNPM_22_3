const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendor: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], 
    thumbnail: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);

