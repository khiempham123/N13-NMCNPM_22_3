// Lắng nghe sự kiện submit của form đăng nhập admin
const adminSignInForm = document.querySelector('#adminSignInForm');

if (adminSignInForm) {
    adminSignInForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn hành động submit mặc định

        // Lấy giá trị từ các input
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        const data = {
            username,
            password
        };

        try {
            const response = await fetch('http://localhost:3000/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Đăng nhập thành công! Đang chuyển hướng đến trang dashboard...');
                console.log(result); // Optional: log server response

                // Lưu token vào localStorage hoặc sessionStorage nếu cần
                localStorage.setItem('adminToken', result.token);

                // Điều hướng người dùng đến trang dashboard sau khi đăng nhập thành công
                window.location.href = '../dashboard/dashboard.html';
            } else {
                const error = await response.json();
                alert('Đăng nhập thất bại: ' + error.message);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    });
}
