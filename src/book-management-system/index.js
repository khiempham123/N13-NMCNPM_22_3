const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const route = require("./routes/client/index.route");

const routeAdmin = require("./routes/admin/index.route");
const { connect } = require("./config/database");
const ForgotPassword = require("./models/forgot-password.models");

const cron = require("node-cron");
const session = require("express-session");

const cloudinary = require("cloudinary");
const http = require("http");
const { Server } = require("ws");
const { setupWebSocket } = require("./controllers/admin/websocket.controller");

cloudinary.v2.config({
  cloud_name: "dp1s19mxg",
  api_key: "813724476411169",
  api_secret: "VvRED_fbBL-Wp_mqXw1x7rbCSic",
  secure: true,
});

const Staffroute = require("./routes/staff/index.route");

const app = express();
const port = process.env.PORT;
app.use(express.static("public"));

app.use(express.json());

app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    headers: ["Content-Type", "authorization"],
  })
);
app.use(
  session({
    secret: "123", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

app.get("/generate-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: "ml_default",
    },
    cloudinary.config().api_secret
  );

  res.json({ timestamp, signature });
});

connect();
route(app);

routeAdmin(app);
Staffroute(app);

cron.schedule("0 * * * *", async () => {
  const currentTime = Date.now();
  await ForgotPassword.deleteMany({ expireAt: { $lt: currentTime } });
});

const server = http.createServer(app);
const wss = new Server({ server });
setupWebSocket(wss);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
