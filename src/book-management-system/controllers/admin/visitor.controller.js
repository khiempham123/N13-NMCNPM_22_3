const Visitor = require("../../models/visitor");

// Hàm tăng số người truy cập
async function increaseVisitorCount(page) {
  let visitor = await Visitor.findOne({ page });
  if (!visitor) {
    visitor = new Visitor({ page, activeVisitors: 1 });
  } else {
    visitor.activeVisitors += 1;
  }
  await visitor.save();
  return visitor.activeVisitors;
}

// Hàm giảm số người truy cập
async function decreaseVisitorCount(page) {
  let visitor = await Visitor.findOne({ page });
  if (!visitor) return 0;

  visitor.activeVisitors = Math.max(visitor.activeVisitors - 1, 0);
  await visitor.save();
  return visitor.activeVisitors;
}

// Hàm lấy số người truy cập hiện tại
async function getVisitorCount(page) {
  const visitor = await Visitor.findOne({ page });
  return visitor ? visitor.activeVisitors : 0;
}


async function getVisitorsByPage(req, res) {
  try {
    const pages = [
      "home", "book", "author", "cart", "order", "fav", 
      "detail", "profile", "history", "contact"
    ];

    const visitors = await Promise.all(pages.map(getVisitorCount));
    const total = visitors.reduce((sum, count) => sum + count, 0);

    res.json({ total });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// Xuất tất cả các hàm từ controller
module.exports = {
  increaseVisitorCount,
  decreaseVisitorCount,
  getVisitorCount,
  getVisitorsByPage,
};