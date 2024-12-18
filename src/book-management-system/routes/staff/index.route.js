const loginRoute =require("./login.route")

module.exports = (app) =>{
    //app.use('/', homeRouter);
    app.use('/staff', loginRoute);
    
}    