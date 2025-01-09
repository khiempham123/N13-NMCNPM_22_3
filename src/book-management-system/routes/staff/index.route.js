const loginRoute =require("./login.route")
const orderRouter = require("./orders.route");
const bookRouter = require("./books.route");
const salesRouter = require("./discounts.route")
const customersRouter =require("./customers.route")
const profileRouter =require("./staff.route")
const { authenticateUser, authorize } = require("../../middleware/authenticateUser");
const authRouter =require("./auth.route")
module.exports = (app) =>{
    app.use("/staff", loginRoute);
    app.use("/staff/customer",authenticateUser, authorize(["staff"]),customersRouter);
    app.use("/staff/order", orderRouter);
    app.use("/staff/books",bookRouter);
    app.use("/staff/sales",salesRouter);
    app.use("/staff/profile",authenticateUser, authorize(["staff"]),profileRouter);
    app.use("/staff/auth",authRouter)
}   