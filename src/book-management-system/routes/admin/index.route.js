const customerRouter = require("./customer.route");
const staffRouter = require("./staff.route");
const reportRouter = require("./report.route");
module.exports = (app) => {
  app.use("/admin/customer", customerRouter);
  app.use("/admin/staff", staffRouter);
  app.use("/admin",reportRouter)
};
