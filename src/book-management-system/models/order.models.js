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
    totalPrice: { type: Number, required: true },
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

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userFullName: { type: String, required: true }, 
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true }, 
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "shiped","canceled"],
      default: "pending",
    }, 
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
