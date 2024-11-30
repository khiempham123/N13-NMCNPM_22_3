document
  .getElementById("changePassword")
  .addEventListener("click", function () {
    document.getElementById("changePasswordPopup").style.display = "flex";
  });

// Đóng popup thêm khách hàng
document
  .getElementById("closeChangePasswordPopup")
  .addEventListener("click", function () {
    document.getElementById("changePasswordPopup").style.display = "none";
  });
