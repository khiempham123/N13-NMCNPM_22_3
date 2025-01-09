const inputs = document.querySelectorAll(".input");

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
function showSuccessModal() {
  const successModal = document.getElementById("successModal");
  successModal.style.display = "block";
}
function validateUsername(inputElement, errorElement) {
  const usernameRegex = /^[a-zA-Z0-9]+$/;

  if (!usernameRegex.test(inputElement.value)) {
    errorElement.style.display = "block";
    errorElement.textContent =
      "Username must contain only letters and numbers.";
  } else {
    errorElement.style.display = "none";
  }
}
const usernameInput = document.getElementById("username");
const usernameError = document.createElement("div");
usernameError.className = "error-message";
usernameError.style.display = "none";
usernameInput.parentNode.appendChild(usernameError);

usernameInput.addEventListener("input", () => {
  validateUsername(usernameInput, usernameError);
});

const closeModalButton = document.getElementById("closeModal");
if (closeModalButton) {
  closeModalButton.addEventListener("click", () => {
    const successModal = document.getElementById("successModal");
    successModal.style.display = "none";
    window.location.href = "login.html";
  });
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".wrapper");
  successModal.style.display = "none";
  if (
    !wrapper.classList.contains("active") &&
    !wrapper.classList.contains("forgot-active") &&
    !wrapper.classList.contains("reset-active")
  ) {
    wrapper.classList.add("active");
  }
});

const signUpBtnLink = document.querySelector(".signUp-link");
const signInBtnLink = document.querySelector(".signIn-link");
const forgotPasswordLink = document.querySelector(".remember-forgot a");
const wrapper = document.querySelector(".wrapper");

if (signUpBtnLink) {
  signUpBtnLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.add("sign-up-active");
    wrapper.classList.remove("active", "forgot-active", "reset-active");
    wrapper.style.height = "650px";
  });
}
if (signInBtnLink) {
  signInBtnLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.add("active");
    wrapper.classList.remove("sign-up-active", "forgot-active", "reset-active");
    wrapper.style.height = "460px";
  });
}

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.add("forgot-active");
    wrapper.classList.remove("active", "reset-active");
    wrapper.style.height = "400px";
  });
}

const forgotPasswordSignInLink = document.querySelector(".backToSignIn-link");

if (forgotPasswordSignInLink) {
  forgotPasswordSignInLink.addEventListener("click", (e) => {
    console.log("click");
    e.preventDefault();
    wrapper.classList.add("active");
    wrapper.classList.remove("sign-up-active", "forgot-active", "reset-active");
    wrapper.style.height = "460px";
  });
}

const resetPasswordSignInLink = document.querySelector(
  ".reset-password .signIn-link"
);
if (resetPasswordSignInLink) {
  resetPasswordSignInLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.add("active");
    wrapper.classList.remove("reset-active");
    wrapper.style.height = "460px";
    const newUrl = window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  });
}
function validatePhone(inputElement, errorElement) {
  const phoneRegex = /^0\d{9}$/;

  if (!phoneRegex.test(inputElement.value)) {
    errorElement.style.display = "block";
    errorElement.textContent =
      "Số điện thoại phải có 10 chữ số, bắt đầu bằng số 0 và chỉ chứa số.";
  } else {
    errorElement.style.display = "none";
  }
}
const phoneInput = document.getElementById("phone");
const phoneError = document.createElement("div");
phoneError.className = "error-message";
phoneError.style.display = "none";
phoneInput.parentNode.appendChild(phoneError);

phoneInput.addEventListener("input", () => {
  validatePhone(phoneInput, phoneError);
});
function validatePasswordConfirmation(
  passwordInput,
  confirmPasswordInput,
  errorElement
) {
  if (confirmPasswordInput.value !== passwordInput.value) {
    errorElement.style.display = "block";
    errorElement.textContent = "Mật khẩu xác nhận không khớp.";
  } else {
    errorElement.style.display = "none";
  }
}
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("signupconfirmPassword");

const confirmPasswordError = document.createElement("div");
confirmPasswordError.className = "error-message";
confirmPasswordError.style.display = "none";
confirmPasswordInput.parentNode.appendChild(confirmPasswordError);

confirmPasswordInput.addEventListener("input", () => {
  validatePasswordConfirmation(
    passwordInput,
    confirmPasswordInput,
    confirmPasswordError
  );
});

const signUpForm = document.querySelector("#signUpForm");
if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById(
      "signupconfirmPassword"
    ).value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const usernameError = document.getElementById("usernameError");

    if (password !== confirmPassword) {
      confirmPasswordError.style.display = "block";
      return;
    } else {
      confirmPasswordError.style.display = "none";
    }

    const data = { username, password, email, phone };

    const response = await fetch("http://localhost:3000/api/client/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.ok) {
      usernameError.style.display = "none";
      showSuccessModal();
      setTimeout(function () {
        window.location.href = "login.html";
      }, 700);
    } else {
      alert(responseData.message || "Registration failed, please try again. ");
      usernameError.style.display = "block";
    }
  });
}

const signInMessage = document.createElement("div");
signInMessage.className = "form-message";
signInMessage.style.display = "none";
const signInForm = document.getElementById("signInForm");
signInForm.insertBefore(signInMessage, signInForm.firstChild);
if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const data = { username, password };
    try {
      const response = await fetch("http://localhost:3000/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const { accessToken, refreshToken, username, role } =
          await response.json();

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        signInMessage.style.display = "block";
        signInMessage.className = "form-message success";
        signInMessage.textContent = "Login successful!";

        setTimeout(() => {
          if (role === "staff") {
            window.location.href = "../staff/staff.html";
          } else if (role === "admin") {
            window.location.href = "../admin/index.html";
          } else if (role === "customer") {
            window.location.href = "../client/pages/home/home.html";
          } else {
            alert("Role không hợp lệ!");
            localStorage.clear();
            window.location.href = "./login/login.html";
          }
        }, 2000);
      } else {
        const error = await response.json();
        signInMessage.style.display = "block";
        signInMessage.className = "form-message error";
        signInMessage.textContent = "Login failed: " + error.message;
      }
    } catch (err) {
      console.error("Error:", err);
      signInMessage.style.display = "block";
      signInMessage.className = "form-message error";
      signInMessage.textContent = "Login failed, please try again.";
    }
  });
}

function startCountdown(duration, countdownElement, resendOtpText) {
  let timer = duration;
  const interval = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    countdownElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (--timer < 0) {
      clearInterval(interval);
      countdownElement.textContent = "OTP code has expired";
      resendOtpText.style.display = "inline";
    }
  }, 1000);
}
const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const otpBox = document.querySelector(".otp-box");

const otpInput = document.getElementById("otpInput");

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("forgotPasswordEmail").value.trim();
    const sendOtpButton = forgotPasswordForm.querySelector(
      "button[type='submit']"
    );
    const timerBox = document.getElementById("timerBox");
    const countdownElement = document.getElementById("countdown");
    const resendOtpText = document.getElementById("resendOtpText");

    try {
      sendOtpButton.style.display = "none";

      const response = await fetch(
        "http://localhost:3000/api/client/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        timerBox.style.display = "block";
        resendOtpText.style.display = "none";
        startCountdown(180, countdownElement, resendOtpText);

        otpBox.style.display = "block";
        otpSubmitBtn.style.display = "block";
        otpInput.required = true;

        const newUrl = `${window.location.pathname}?email=${encodeURIComponent(
          email
        )}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      } else {
        const error = await response.json();
        alert("Gửi yêu cầu thất bại: " + error.message);
        sendOtpButton.style.display = "block";
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
      sendOtpButton.style.display = "block";
    }
  });
}
function validateEmail(inputElement, errorElement) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.com+$/;
  if (!emailRegex.test(inputElement.value)) {
    errorElement.style.display = "block";
    errorElement.textContent =
      "Email not valid. Please enter a valid email address.";
  } else {
    errorElement.style.display = "none";
  }
}
const emailInput = document.getElementById("forgotPasswordEmail");
const urlParams = new URLSearchParams(window.location.search);
const emailFromUrl = urlParams.get("email");
const emailInput2 = document.getElementById("email");
const emailError = document.createElement("div");
emailError.className = "error-message";
emailError.style.display = "none";
emailInput2.parentNode.appendChild(emailError);

emailInput2.addEventListener("input", () => {
  validateEmail(emailInput2, emailError);
});
if (emailFromUrl) {
  emailInput.value = emailFromUrl;

  const timerBox = document.getElementById("timerBox");
  const resendOtpText = document.getElementById("resendOtpText");
  const otpBox = document.querySelector(".otp-box");
  const otpSubmitBtn = document.getElementById("otpSubmitBtn");

  timerBox.style.display = "block";
  resendOtpText.style.display = "none";
  otpBox.style.display = "block";
  otpSubmitBtn.style.display = "block";
}
otpSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const otp = otpInput.value.trim();
  const email = new URLSearchParams(window.location.search).get("email");
  const otpError = document.getElementById("otpError");

  try {
    const response = await fetch(
      "http://localhost:3000/api/client/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (response.ok) {
      wrapper.classList.add("reset-active");
      wrapper.classList.remove("forgot-active");
      otpError.style.display = "none";
    } else {
      otpError.textContent = "OTP code does not match. Please re-enter.";
      otpError.style.display = "block";
    }
  } catch (err) {
    console.error("Error:", err);
    otpError.textContent = "An error occurred. Please try again later.";
    otpError.style.display = "block";
  }
});

const resendOtpText = document.getElementById("resendOtpText");

if (resendOtpText) {
  resendOtpText.addEventListener("click", async () => {
    const email = document.getElementById("forgotPasswordEmail").value;
    const countdownElement = document.getElementById("countdown");
    resendOtpText.style.display = "none";

    try {
      const response = await fetch(
        "http://localhost:3000/api/client/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        startCountdown(180, countdownElement, resendOtpText);
      } else {
        const error = await response.json();
        alert("Gửi lại OTP thất bại: " + error.message);
        resendOtpText.style.display = "inline";
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again later.");
      resendOtpText.style.display = "inline";
    }
  });
}
const resetPasswordForm = document.querySelector("#resetPasswordForm");

if (resetPasswordForm) {
  const resetPasswordMessage = document.createElement("div");
  resetPasswordMessage.className = "form-message";
  resetPasswordMessage.style.display = "none";
  resetPasswordForm.insertBefore(
    resetPasswordMessage,
    resetPasswordForm.firstChild
  );

  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (newPassword !== confirmPassword) {
      resetPasswordMessage.style.display = "block";
      resetPasswordMessage.className = "form-message error";
      resetPasswordMessage.textContent =
        "Password confirmation does not match the new password.";
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    const data = {
      email,
      password: newPassword,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/client/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        resetPasswordMessage.style.display = "block";
        resetPasswordMessage.className = "form-message success";
        resetPasswordMessage.textContent = "Reset password successful!";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        const error = await response.json();
        resetPasswordMessage.style.display = "block";
        resetPasswordMessage.className = "form-message error";
        resetPasswordMessage.textContent =
          "Reset password failed: " + error.message;
      }
    } catch (err) {
      console.error("Error:", err);
      resetPasswordMessage.style.display = "block";
      resetPasswordMessage.className = "form-message error";
      resetPasswordMessage.textContent =
        "Reset password failed. Please try again.";
    }
  });
}

inputsToValidate.forEach((input) => {
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.style.display = "none";
  errorElement.textContent = "This field is required.";
  input.parentNode.appendChild(errorElement);

  input.addEventListener("input", () => {
    validateInput(input, errorElement);
  });
});
