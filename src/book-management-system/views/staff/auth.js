const jwt = require('jsonwebtoken');
const fetch = require('node-fetch'); // Nếu chưa có, chạy `npm install node-fetch`

// Kiểm tra token có hết hạn hay không
function isTokenExpired(token) {
  const decoded = jwt.decode(token); // Giải mã token mà không cần secret
  const now = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
  return decoded.exp < now; // Kiểm tra thời gian hết hạn
}

// Làm mới Access Token bằng Refresh Token
async function refreshToken(refreshToken) {
  if (!refreshToken) {
    console.error('No refresh token provided.');
    return null;
  }

  try {
    const response = await fetch('http://localhost:3000/staff/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.accessToken; // Trả về Access Token mới
    } else {
      console.error('Failed to refresh token on server.');
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Hàm lấy Access Token (tự động làm mới nếu hết hạn)
async function getAccessToken(token, refreshToken) {
  if (!token || isTokenExpired(token)) {
    // Nếu token không có hoặc đã hết hạn, làm mới token
    return await refreshToken(refreshToken);
  }
  return token; // Token còn hợp lệ
}

module.exports = { getAccessToken, refreshToken, isTokenExpired };
