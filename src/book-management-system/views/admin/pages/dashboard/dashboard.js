// public/dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/admin/api/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Bao gồm cookie
        });

        if (response.ok) {
            const adminData = await response.json();
            // Hiển thị dữ liệu admin lên trang dashboard
            document.querySelector('.dashboard-wrapper').innerHTML += `<p>Chào mừng ${adminData.username}!</p>`;
        } else {
            alert('Bạn cần đăng nhập như Admin để truy cập Dashboard.');
            window.location.href = '/admin/login';
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }

    // Xử lý logout
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/admin/logout', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Bao gồm cookie
                });

                if (response.ok) {
                    alert('Đã đăng xuất thành công.');
                    window.location.href = '/admin/login';
                } else {
                    const error = await response.json();
                    alert('Đăng xuất thất bại: ' + error.message);
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        });
    }
});
