document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-right-from-bracket')) {
      handleLogout();
    }
  });
});

function handleLogout() {
  const refreshToken = localStorage.getItem('refreshToken');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  localStorage.removeItem('role');

  fetch('http://localhost:3000/staff/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out on server.');
      }
    })
    .catch((error) => console.error('Error logging out:', error));

  alert('You have been logged out.');
  window.location.href = './login/login.html';
}