const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(403).json({ message: 'Chưa có token' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    res.status(200).json({ message: 'Token hợp lệ' });
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body; // Lấy refresh token từ body request

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token không được cung cấp' });
  }

  try {
    // Xác minh refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret');

    // Kiểm tra refresh token trong database (nếu cần)
    const staff = await Staff.findOne({ _id: decoded.id, refreshToken });
    if (!staff) {
      return res.status(403).json({ message: 'Refresh token không hợp lệ' });
    }

    // Tạo mới access token
    const newAccessToken = jwt.sign(
      { id: staff._id, username: staff.username, role: staff.role },
      process.env.JWT_SECRET || 'your_secret_key', // Secret key
      { expiresIn: '15m' } // Thời gian hết hạn của access token
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Refresh token đã hết hạn' });
    } else {
      res.status(401).json({ message: 'Refresh token không hợp lệ' });
    }
  }
};