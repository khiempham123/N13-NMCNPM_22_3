const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    //await mongoose.connect("mongodb+srv://masterdzzzz:datkochin@cluster0.3s025.mongodb.net/", {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 giây
    });
    console.log("Connect success!");
  } catch (error) {
    console.log("Connect error!");
  }
};
