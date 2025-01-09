const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  page: { type: String, required: true },
  activeVisitors: { type: Number, default: 0 },
});

module.exports = mongoose.model("Visitor", VisitorSchema);
