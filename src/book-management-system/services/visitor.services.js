const Visitor = require("../models/visitor");

async function getVisitorCount(page) {
  const visitor = await Visitor.findOne({ page });
  return visitor ? visitor.activeVisitors : 0;
}

module.exports = { getVisitorCount };
