const homeRouter = require('./home.route')
const productRouter = require('./product.route')
const detailRouter = require('./detail.route')

module.exports = (app) =>{
    app.use('/', homeRouter);
    app.use('/products', productRouter);
    app.use('/detail', detailRouter);
}    