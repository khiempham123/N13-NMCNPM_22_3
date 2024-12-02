const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    thumbnail: { type: String },
    title: { type: String },
    totalPrice: { type: Number, required: true }, // Có thể tính bằng quantity * price
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema], // Mảng chứa các items trong giỏ hàng
    totalAmount: { type: Number, required: true, default: 0 }, // Tổng tiền trong giỏ hàng
    // status: { type: String, default: "active" }, // Trạng thái giỏ hàng (active, completed, etc.)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
