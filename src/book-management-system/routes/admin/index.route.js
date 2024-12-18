const customerRouter = require("./customer.route");
const staffRouter = require("./staff.route");

module.exports = (app) => {
  app.use("/admin/customer", customerRouter);
  app.use("/admin/staff", staffRouter);
};
