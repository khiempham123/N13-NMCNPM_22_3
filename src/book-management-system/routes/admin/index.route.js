// routes/admin/index.route.js
const adminRouter = require('./admin.route');

module.exports = (app) => {
    app.use('/admin', adminRouter);
};
