const Visitor = require("../models/visitor");

// Hàm lấy số người truy cập từ cơ sở dữ liệu
async function getVisitorCount(page) {
  const visitor = await Visitor.findOne({ page });
  return visitor ? visitor.activeVisitors : 0;
}

module.exports = { getVisitorCount };