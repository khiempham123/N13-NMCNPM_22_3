const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        
        mongoose.connect('mongodb://localhost:27017/book_management', { autoIndex: false });

        console.log("Connect success!");
    } catch (error) {
        console.log("Connect error!");
    

        
    }
}

