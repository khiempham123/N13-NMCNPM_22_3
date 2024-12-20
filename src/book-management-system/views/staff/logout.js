document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.fa-right-from-bracket'); // Lấy nút logout
  
    // Xử lý sự kiện click vào nút logout
    logoutButton.addEventListener('click', () => {
      // Xóa token khỏi localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
  
      // Gửi yêu cầu logout lên server (nếu cần, để xóa refreshToken khỏi DB)
      fetch('http://localhost:3000/staff/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({refreshToken}),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Logged out successfully');
          } else {
            console.error('Failed to log out on server.');
          }
        })
        .catch((error) => console.error('Error logging out:', error));
  
      // Chuyển hướng người dùng về trang login
      alert('You have been logged out.');
      window.location.href = './login/login.html';
    });
  });