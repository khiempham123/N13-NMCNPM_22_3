
const inputs = document.querySelectorAll(".input");

// Xử lý hiệu ứng khi input được focus hoặc mất focus
function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}
// Hàm hiển thị modal thành công
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.style.display = 'flex';  // Hiển thị modal
}
function validateUsername(inputElement, errorElement) {
    // Biểu thức regex kiểm tra tên đăng nhập (chỉ cho phép chữ cái không dấu, số)
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!usernameRegex.test(inputElement.value)) {
        errorElement.style.display = 'block'; // Hiển thị lỗi
        errorElement.textContent = 'Tên đăng nhập không được chứa dấu câu, ký tự đặc biệt hoặc dấu tiếng Việt.';
    } else {
        errorElement.style.display = 'none'; // Ẩn lỗi nếu hợp lệ
    }
}
// Áp dụng kiểm tra với trường tên đăng nhập
const usernameInput = document.getElementById('username'); // Trường nhập tên đăng nhập
const usernameError = document.createElement('div');
usernameError.className = 'error-message';
usernameError.style.display = 'none';
usernameInput.parentNode.appendChild(usernameError);

usernameInput.addEventListener('input', () => {
    validateUsername(usernameInput, usernameError);
});

// Đóng modal khi người dùng nhấn vào nút "Đóng"
const closeModalButton = document.getElementById('closeModal');
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'none';  // Ẩn modal
        window.location.href = 'login.html';
    });
}

inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    successModal.style.display = 'none';
    // Kiểm tra xem lớp hiện tại có phải là lớp hiển thị hay không
    if (!wrapper.classList.contains('active') && 
        !wrapper.classList.contains('forgot-active') &&
        !wrapper.classList.contains('reset-active')) {
        wrapper.classList.add('active'); // Hiển thị form Đăng nhập mặc định
    }

    console.log('Default wrapper classes:', wrapper.classList);
});

// Chuyển đổi giữa các form Đăng nhập, Đăng ký, Quên mật khẩu, Đặt lại mật khẩu
const signUpBtnLink = document.querySelector('.signUp-link');
const signInBtnLink = document.querySelector('.signIn-link');
const forgotPasswordLink = document.querySelector('.remember-forgot a'); // Link "Forgot Password"
const wrapper = document.querySelector('.wrapper');

// Khi nhấn vào "Đăng ký"
if (signUpBtnLink) {
    signUpBtnLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('sign-up-active'); // Thêm lớp để hiển thị form Đăng ký
        wrapper.classList.remove('active', 'forgot-active', 'reset-active'); // Ẩn các form khác
        console.log('Current wrapper classes (Đăng ký):', wrapper.classList);
    });
}
// Khi nhấn vào "Đăng nhập"
if (signInBtnLink) {
    signInBtnLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active'); // Hiển thị form Đăng nhập
        wrapper.classList.remove('sign-up-active', 'forgot-active', 'reset-active'); // Ẩn các form khác
        console.log('Current wrapper classes (Đăng nhập):', wrapper.classList);
    });
}

// Khi nhấn vào "Quên mật khẩu"
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('forgot-active'); // Hiển thị form Quên mật khẩu
        wrapper.classList.remove('active', 'reset-active'); // Ẩn các form khác
        console.log('Current wrapper classes (Quên mật khẩu):', wrapper.classList);
    });
}


// Xử lý quay lại đăng nhập từ Quên mật khẩu
const forgotPasswordSignInLink = document.querySelector('.forgot-password .signIn-link');
if (forgotPasswordSignInLink) {
    forgotPasswordSignInLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active'); // Hiển thị form Đăng nhập
        wrapper.classList.remove('forgot-active'); // Ẩn form Quên mật khẩu

        // Xóa tham số email trong URL
        const newUrl = window.location.pathname; // Lấy URL gốc (không có query parameters)
        window.history.replaceState(null, '', newUrl);

        console.log('Current wrapper classes (Trở lại Đăng nhập):', wrapper.classList);
    });
}

// Xử lý quay lại đăng nhập từ Reset mật khẩu
const resetPasswordSignInLink = document.querySelector('.reset-password .signIn-link');
if (resetPasswordSignInLink) {
    resetPasswordSignInLink.addEventListener('click', (e) => {
        e.preventDefault(); // Ngăn hành động mặc định của thẻ <a>
        wrapper.classList.add('active'); // Hiển thị form Đăng nhập
        wrapper.classList.remove('reset-active'); // Ẩn form Reset mật khẩu

        // Xóa tham số email trong URL
        const newUrl = window.location.pathname; // Lấy URL gốc (không có query parameters)
        window.history.replaceState(null, '', newUrl);

        console.log('Current wrapper classes (Quay lại Đăng nhập từ Reset mật khẩu):', wrapper.classList);
    });
}
function validatePhone(inputElement, errorElement) {
    // Biểu thức regex kiểm tra số điện thoại (phải bắt đầu bằng 0 và chỉ chứa 10 số)
    const phoneRegex = /^0\d{9}$/;

    if (!phoneRegex.test(inputElement.value)) {
        errorElement.style.display = 'block'; // Hiển thị lỗi nếu không hợp lệ
        errorElement.textContent = 'Số điện thoại phải có 10 chữ số, bắt đầu bằng số 0 và chỉ chứa số.';
    } else {
        errorElement.style.display = 'none'; // Ẩn lỗi nếu hợp lệ
    }
}
// Áp dụng kiểm tra với trường số điện thoại
const phoneInput = document.getElementById('phone'); // Trường nhập số điện thoại
const phoneError = document.createElement('div');
phoneError.className = 'error-message';
phoneError.style.display = 'none';
phoneInput.parentNode.appendChild(phoneError);

phoneInput.addEventListener('input', () => {
    validatePhone(phoneInput, phoneError);
});
function validatePasswordConfirmation(passwordInput, confirmPasswordInput, errorElement) {
    if (confirmPasswordInput.value !== passwordInput.value) {
        errorElement.style.display = 'block';  // Hiển thị lỗi nếu mật khẩu không khớp
        errorElement.textContent = 'Mật khẩu xác nhận không khớp.';
    } else {
        errorElement.style.display = 'none';  // Ẩn lỗi nếu mật khẩu khớp
    }
}
const passwordInput = document.getElementById('password'); // Trường mật khẩu
const confirmPasswordInput = document.getElementById('signupconfirmPassword'); // Trường xác nhận mật khẩu

const confirmPasswordError = document.createElement('div');
confirmPasswordError.className = 'error-message';
confirmPasswordError.style.display = 'none';
confirmPasswordInput.parentNode.appendChild(confirmPasswordError);

// Lắng nghe sự kiện nhập liệu trong trường xác nhận mật khẩu
confirmPasswordInput.addEventListener('input', () => {
    validatePasswordConfirmation(passwordInput, confirmPasswordInput, confirmPasswordError);
});
// Form đăng ký
const signUpForm = document.querySelector('#signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn hành động submit mặc định
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('signupconfirmPassword').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const usernameError = document.getElementById('usernameError'); 

        // Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            confirmPasswordError.style.display = 'block'; // Hiển thị thông báo lỗi nếu mật khẩu không khớp
            return;
        } else {
            confirmPasswordError.style.display = 'none'; // Ẩn thông báo lỗi nếu mật khẩu khớp
        }

    const data = { username, password, email, phone };


        const response = await fetch('http://localhost:3000/api/client/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            usernameError.style.display = 'none'; // Ẩn thông báo lỗi nếu đăng ký thành công
            // Hiển thị modal thông báo thành công
            showSuccessModal();
            setTimeout(function () {
                window.location.href = 'login.html'; // Thay đổi đường dẫn nếu cần
            }, 3000);
            
        } else {
            usernameError.style.display = 'block';
            
        }
    }
)
}

// Tạo thông báo trên form
const signInMessage = document.createElement('div');
signInMessage.className = 'form-message';
signInMessage.style.display = 'none'; // Ẩn thông báo mặc định
signInForm.insertBefore(signInMessage, signInForm.firstChild); // Thêm vào đầu form

if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn hành động submit mặc định
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const data = { username, password };
        console.log("Login data being sent:", { username, password });
        try {
            const response = await fetch('http://localhost:3000/api/client/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                signInMessage.style.display = 'block'; // Hiển thị thông báo
                signInMessage.className = 'form-message success'; // Thêm lớp thành công
                signInMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
                
                setTimeout(() => {
                    window.location.href = '../home/home.html'; // Chuyển hướng sau 2 giây
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



function startCountdown(duration, countdownElement, resendOtpText) {
    let timer = duration;
    const interval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        if (--timer < 0) {
            clearInterval(interval);
            // Hiển thị thông báo "Mã OTP đã hết hạn" và nút "Gửi lại OTP"
            countdownElement.textContent = "Mã OTP đã hết hạn";
            resendOtpText.style.display = "inline";
        }
    }, 1000);
}
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
const otpBox = document.querySelector('.otp-box');

const otpInput = document.getElementById('otpInput');

// Xử lý gửi yêu cầu quên mật khẩu
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn hành động submit mặc định

        const email = document.getElementById('forgotPasswordEmail').value.trim();
        const sendOtpButton = forgotPasswordForm.querySelector("button[type='submit']");
        const timerBox = document.getElementById("timerBox");
        const countdownElement = document.getElementById("countdown");
        const resendOtpText = document.getElementById("resendOtpText");

        try {
            sendOtpButton.style.display = "none"; // Ẩn nút "Gửi yêu cầu"

            // Gửi yêu cầu tới API
            const response = await fetch('http://localhost:3000/api/client/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                timerBox.style.display = "block";
                resendOtpText.style.display = "none"; // Ẩn "Gửi lại OTP"
                startCountdown(180, countdownElement, resendOtpText);

                otpBox.style.display = "block"; // Hiển thị ô nhập OTP
                otpSubmitBtn.style.display = "block";
                otpInput.required = true;

                // Cập nhật URL bằng cách thêm email vào query parameters
                const newUrl = `${window.location.pathname}?email=${encodeURIComponent(email)}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
            } else {
                const error = await response.json();
                alert('Gửi yêu cầu thất bại: ' + error.message);
                sendOtpButton.style.display = "block"; // Hiện lại nút nếu lỗi
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            sendOtpButton.style.display = "block"; // Hiện lại nút nếu lỗi
        }
    });
}
function validateEmail(inputElement, errorElement) {
    // Biểu thức regex kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.com+$/;
    if (!emailRegex.test(inputElement.value)) {
        errorElement.style.display = 'block'; // Hiển thị lỗi nếu email không hợp lệ
        errorElement.textContent = 'Email không hợp lệ. Vui lòng nhập đúng định dạng.';
    } else {
        errorElement.style.display = 'none'; // Ẩn lỗi nếu email hợp lệ
    }
}
// Lấy email từ URL và gán vào input
const emailInput = document.getElementById('forgotPasswordEmail');
const urlParams = new URLSearchParams(window.location.search);
const emailFromUrl = urlParams.get('email');
const emailInput2 = document.getElementById('email');
const emailError = document.createElement('div');
emailError.className = 'error-message'; 
emailError.style.display = 'none';
emailInput2.parentNode.appendChild(emailError);

emailInput2.addEventListener('input', () => {
    validateEmail(emailInput2, emailError);
});
if (emailFromUrl) {
    emailInput.value = emailFromUrl;

    // Hiển thị các thành phần liên quan đến OTP
    const timerBox = document.getElementById("timerBox");
    const resendOtpText = document.getElementById("resendOtpText");
    const otpBox = document.querySelector('.otp-box');
    const otpSubmitBtn = document.getElementById('otpSubmitBtn');

    timerBox.style.display = "block";
    resendOtpText.style.display = "none";
    otpBox.style.display = "block";
    otpSubmitBtn.style.display = "block";
}
otpSubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Ngăn hành động submit mặc định

    const otp = otpInput.value.trim(); // Lấy giá trị OTP
    const email = new URLSearchParams(window.location.search).get('email'); // Lấy email từ URL
    const otpError = document.getElementById('otpError'); // Lấy thẻ hiển thị lỗi OTP

    try {
        const response = await fetch('http://localhost:3000/api/client/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, otp }) // Gửi email và OTP tới API
        });

        if (response.ok) {
            // OTP hợp lệ, chuyển qua trang Reset mật khẩu
            wrapper.classList.add('reset-active');
            wrapper.classList.remove('forgot-active');
            otpError.style.display = 'none'; // Ẩn thông báo lỗi nếu thành công
        } else {
            // OTP không hợp lệ
            otpError.textContent = 'OTP không khớp. Xin vui lòng nhập lại.';
            otpError.style.display = 'block'; // Hiển thị thông báo lỗi
        }
    } catch (err) {
        console.error('Error:', err);
        otpError.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        otpError.style.display = 'block'; // Hiển thị thông báo lỗi khi có lỗi
    }
});

const resendOtpText = document.getElementById("resendOtpText");

if (resendOtpText) {
    resendOtpText.addEventListener("click", async () => {
        const email = document.getElementById("forgotPasswordEmail").value;
        const countdownElement = document.getElementById("countdown");
        resendOtpText.style.display = "none"; // Ẩn dòng chữ để tránh spam

        try {
            const response = await fetch('http://localhost:3000/api/client/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                startCountdown(180, countdownElement, resendOtpText);
            } else {
                const error = await response.json();
                alert('Gửi lại OTP thất bại: ' + error.message);
                resendOtpText.style.display = "inline"; // Hiển thị lại nếu có lỗi
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
            resendOtpText.style.display = "inline";
        }
    });
}
// Form Reset Password
const resetPasswordForm = document.querySelector('#resetPasswordForm');

if (resetPasswordForm) {
    // Tạo thẻ thông báo trên form
    const resetPasswordMessage = document.createElement('div');
    resetPasswordMessage.className = 'form-message';
    resetPasswordMessage.style.display = 'none'; // Ẩn thông báo mặc định
    resetPasswordForm.insertBefore(resetPasswordMessage, resetPasswordForm.firstChild); // Chèn thông báo vào đầu form

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn hành động submit mặc định

        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // Kiểm tra mật khẩu
        if (newPassword !== confirmPassword) {
            resetPasswordMessage.style.display = 'block';
            resetPasswordMessage.className = 'form-message error'; // Thêm lớp lỗi
            resetPasswordMessage.textContent = 'Mật khẩu xác nhận không khớp. Vui lòng thử lại.';
            return;
        }

        // Lấy email từ URL (nếu cần sử dụng để gửi cùng request)
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');

        const data = {
            email,
            password: newPassword
        };

        try {
            const response = await fetch('http://localhost:3000/api/client/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                resetPasswordMessage.style.display = 'block';
                resetPasswordMessage.className = 'form-message success'; // Thêm lớp thành công
                resetPasswordMessage.textContent = 'Đặt lại mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...';

                setTimeout(() => {
                    window.location.href = 'login.html'; // Chuyển hướng sau 2 giây
                }, 2000);
            } else {
                const error = await response.json();
                resetPasswordMessage.style.display = 'block';
                resetPasswordMessage.className = 'form-message error'; // Thêm lớp lỗi
                resetPasswordMessage.textContent = 'Đặt lại mật khẩu thất bại: ' + error.message;
            }
        } catch (err) {
            console.error('Error:', err);
            resetPasswordMessage.style.display = 'block';
            resetPasswordMessage.className = 'form-message error'; // Thêm lớp lỗi
            resetPasswordMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        }
    });
}




inputsToValidate.forEach(input => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.display = 'none';
    errorElement.textContent = 'Không được chứa ký tự đặc biệt hoặc dấu câu.';
    input.parentNode.appendChild(errorElement);

    input.addEventListener('input', () => {
        validateInput(input, errorElement);
    });
});

