const path = require('path');
const express = require('express');
const cors = require('cors'); // Import thư viện CORS
require('dotenv').config();
const route = require('./routes/client/index.route');
const { connect } = require('./config/database'); // Import hàm connect từ database.js
const ForgotPassword = require("./models/forgot-password.models")
const cron = require("node-cron");
const session = require('express-session');
const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(express.json());
// cấu hình cors
app.use(cors({
  origin: 'http://127.0.0.1:5501',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(session({
  secret: '123', // Đặt secret key bảo mật
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Đặt `true` nếu sử dụng HTTPS
}));


// Kết nối tới MongoDB
connect();

// Định tuyến
route(app);
// Xóa OTP hết hạn mỗi giờ
cron.schedule("0 * * * *", async () => {
  const currentTime = Date.now();
  console.log("Cron job running to clean expired OTPs...");
  await ForgotPassword.deleteMany({ expireAt: { $lt: currentTime } });
  console.log("Expired OTPs cleaned successfully.");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});