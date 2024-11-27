
const homeRouter = require('./home.route');
const productRouter = require('./product.route');
const clientRouter = require('./user.route');
const adminRoutes = require('../admin/index.route');
module.exports = (app) => {
    app.use('/', homeRouter);          
    app.use('/api/products', productRouter);
    app.use('/api/client', clientRouter);
    adminRoutes(app);
};