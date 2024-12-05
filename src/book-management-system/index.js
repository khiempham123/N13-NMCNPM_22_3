const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Import thư viện CORS

const route = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(
  cors({
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    headers: ["Content-Type", "authorization"],
  })
);

// route
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
