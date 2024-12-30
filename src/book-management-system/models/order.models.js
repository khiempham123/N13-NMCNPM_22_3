const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String},
    totalPrice: { type: Number, required: true }, // quantity * price
    thumbnail: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); // Kiểm tra URL hợp lệ
        },
        message: "Invalid URL format for thumbnail",
      },
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userFullName: { type: String, required: true }, // Tên đầy đủ của người dùng
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    items: [orderItemSchema], // Các sách đã mua
    totalAmount: { type: Number, required: true }, // Tổng tiền đơn hàng
    // shippingFee: { type: Number, default: 10 },
    grandTotal: { type: Number, required: true }, // Tổng tiền sau khi cộng phí giao hàng
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "shiped","canceled"],
      default: "pending",
    }, // Trạng thái đơn hàng
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
