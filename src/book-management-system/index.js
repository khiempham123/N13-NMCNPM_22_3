const express = require('express')
require('dotenv').config();
const cors = require('cors');
const database = require('./config/database')
const route = require('./routes/client/index.route')
const adminRoutes = require('./routes/admin/index.route')
const path = require('path');
const session = require('express-session');
const cron = require("node-cron");
const ForgotPassword = require("./models/forgot-password.models")
const app = express()
const port = process.env.PORT;
app.use(cors({
  origin: 'http://127.0.0.1:5500', // URL frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Cấu hình các tệp tĩnh
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/client/pages/shop/shop.html'));
});

app.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/client/pages/detail/detail.html'));
});
app.use(session({
  secret: '123', // Đặt secret key bảo mật
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Đặt `true` nếu sử dụng HTTPS
}));
app.use(express.static("public"))
app.use(express.json());
database.connect();
route(app);
app.use('/api/admin', adminRoutes); // Đường dẫn /api/admin
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// Xóa OTP hết hạn mỗi giờ
cron.schedule("0 * * * *", async () => {
  const currentTime = Date.now();
  console.log("Cron job running to clean expired OTPs...");
  await ForgotPassword.deleteMany({ expireAt: { $lt: currentTime } });
  console.log("Expired OTPs cleaned successfully.");
});