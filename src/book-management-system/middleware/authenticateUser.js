const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]; // Lấy token từ header Authorization
  console.log("data:", token);
  if (!token) {
    // alert("Bạn cần đăng nhập để truy cập");
    return res.status(401).json({ message: "Bạn cần đăng nhập để truy cập" });
  }

  // Kiểm tra token
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    // Gán thông tin người dùng vào req.user
    req.user = decoded;
    next(); // Tiếp tục xử lý yêu cầu
  });
};

module.exports = authenticateUser;
