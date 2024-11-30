// Khi nhấn vào nút gear, hiển thị popup
document
  .getElementById("openEditPersonalModal")
  .addEventListener("click", function () {
    document.getElementById("editPersonalPopup").style.display = "flex";
  });

// Đóng popup thêm khách hàng
document
  .getElementById("closeEditPersonalPopup")
  .addEventListener("click", function () {
    document.getElementById("editPersonalPopup").style.display = "none";
  });
