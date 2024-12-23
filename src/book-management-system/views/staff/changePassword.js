document.addEventListener("DOMContentLoaded", () => {
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const changePasswordPopup = document.getElementById("changePasswordPopup");
  const closeChangePasswordBtn = document.getElementById("closeChangePasswordPopup");
  const openChangePassword = document.getElementById("changePassword");

  // Hiển thị popup
  openChangePassword.addEventListener("click", () => {
    changePasswordPopup.style.display = "flex";
  });

  // Ẩn popup
  closeChangePasswordBtn.addEventListener("click", () => {
    changePasswordPopup.style.display = "none";
  });

  // Gửi yêu cầu thay đổi mật khẩu
  changePasswordBtn.addEventListener("click", async () => {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        window.location.href = "login.html";
        return;
      }

      const response = await fetch("http://localhost:3000/staff/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        changePasswordPopup.style.display = "none";
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});