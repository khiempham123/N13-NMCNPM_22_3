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