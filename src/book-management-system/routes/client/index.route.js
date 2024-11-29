const homeRouter = require('./home.route')
const bookRouter = require('./book.route')
const detailRouter = require('./detail.route')
const userRouter = require("./user.route");
module.exports = (app) =>{
    app.use('/', homeRouter);
    app.use('/book', bookRouter);
    app.use('/detail', detailRouter);
    app.use('/api/client',userRouter)
}    