const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  page: { type: String, required: true }, // URL hoặc tên trang
  activeVisitors: { type: Number, default: 0 }, // Số người đang truy cập
});

module.exports = mongoose.model("Visitor", VisitorSchema);
