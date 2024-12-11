const express = require("express");
const cors = require("cors"); // Import thư viện CORS
require("dotenv").config();
const { connect } = require("./config/database"); // Import hàm connect từ database.js
const bookRoutes = require("./routes/staff/books.route");
const discountRoutes = require("./routes/staff/discounts.route");
const customers = require("./routes/staff/customers.route")
const orders = require("./routes/staff/orders.route")
const registerRoutes = require("./routes/staff/register.route");
const loginRoutes = require("./routes/staff/login.route");
const changePasswordRoutes = require("./routes/staff/changePassword.route");
const staff = require("./routes/staff/staff.route");
const app = express();
const port = process.env.PORT;


app.use(express.static("public"));
// cấu hình cors
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
// Kết nối tới MongoDB
connect();

// Định tuyến
app.use("/api/books", bookRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/customers", customers);
app.use("/api/orders", orders);
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/change-password", changePasswordRoutes);
app.use("/api/staffs", staff);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});