const homeRouter = require('./home.route')
const productRouter = require('./product.route')
const detailRouter = require('./detail.route')
const profileRouter = require("./profile.route");
const bookRouter =require("./book.route")
const orderRouter = require("./order.route");
module.exports = (app) =>{
    app.use('/', homeRouter);
    app.use('/products', productRouter);
    app.use('/detail', detailRouter);
    app.use("/profile", profileRouter);
    app.use("/book", bookRouter);
    app.use("/order", orderRouter);
}    