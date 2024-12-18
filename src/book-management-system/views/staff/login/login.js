const inputs = document.querySelectorAll(".input");

// Áp dụng kiểm tra với trường tên đăng nhập
const usernameInput = document.getElementById('username'); // Trường nhập tên đăng nhập
const usernameError = document.createElement('div');
usernameError.className = 'error-message';
usernameError.style.display = 'none';

const signInMessage = document.createElement('div');
signInMessage.className = 'form-message';
signInMessage.style.display = 'none'; // Ẩn thông báo mặc định
const signInForm = document.getElementById('signInForm');
signInForm.insertBefore(signInMessage, signInForm.firstChild); // Thêm vào đầu form
if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn hành động submit mặc định
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const data = { username, password };
        console.log("Login data being sent:", { username, password });
        try {
            const response = await fetch('http://localhost:3000/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                signInMessage.style.display = 'block'; // Hiển thị thông báo
                signInMessage.className = 'form-message success'; // Thêm lớp thành công
                signInMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
                
                setTimeout(() => {
                    window.location.href = '../staff.html'; // Chuyển hướng sau 2 giây
                }, 2000);
            } else {
                const error = await response.json();
                signInMessage.style.display = 'block'; // Hiển thị thông báo lỗi
                signInMessage.className = 'form-message error'; // Thêm lớp lỗi
                signInMessage.textContent = 'Đăng nhập thất bại: ' + error.message;
            }
        } catch (err) {
            console.error('Error:', err);
            signInMessage.style.display = 'block'; // Hiển thị lỗi kết nối
            signInMessage.className = 'form-message error'; // Thêm lớp lỗi
            signInMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        }
    });
}