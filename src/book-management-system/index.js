const express = require("express");
const cors = require("cors"); // Import thư viện CORS
require("dotenv").config();
const route = require("./routes/client/index.route");
const { connect } = require("./config/database"); // Import hàm connect từ database.js

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
// cấu hình cors
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Kết nối tới MongoDB
connect();

// Định tuyến
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
