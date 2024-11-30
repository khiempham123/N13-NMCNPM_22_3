const homeRouter = require("./home.route");
const detailRouter = require("./detail.route");
const userRouter = require("./user.route");

module.exports = (app) => {
  app.use("/", homeRouter);
  app.use("/detail", detailRouter);
  app.use("/api/client", userRouter);
};
