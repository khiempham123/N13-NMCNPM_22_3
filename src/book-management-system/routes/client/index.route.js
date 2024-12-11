const homeRouter = require("./home.route");
const detailRouter = require("./detail.route");
const userRouter = require("./user.route");
const cartRouter = require("./cart.route");
const favRouter = require("./fav.route");
const vendorRouter = require("./vendor.route");
const profileRouter = require("./profile.route");
const bookRouter = require("./book.route");

module.exports = (app) => {
  app.use("/", homeRouter);
  app.use("/detail", detailRouter);
  app.use("/api/client", userRouter);
  app.use("/", cartRouter);
  app.use("/", favRouter);
  app.use("/vendor", vendorRouter);
  app.use("/profile", profileRouter);
  app.use("/book", bookRouter);
};
