// Mở popup edit sách
document.getElementById("editOrder").addEventListener("click", function () {
  document.getElementById("editOrderPopup").style.display = "flex";
});

// Đóng popup edit sách
document
  .getElementById("closeEditOrderPopup")
  .addEventListener("click", function () {
    document.getElementById("editOrderPopup").style.display = "none";
  });

document;
// Lắng nghe sự thay đổi của dropdown
document.getElementById("order-status").addEventListener("change", function () {
  var icon = document.getElementById("status-icon");
  var selectedOption = this.value; // Lấy giá trị option được chọn

  // Loại bỏ tất cả các lớp màu cũ
  icon.classList.remove(
    "status-order-received",
    "status-processing",
    "status-packed",
    "status-shipped"
  );

  // Thêm lớp màu mới dựa trên lựa chọn
  if (selectedOption === "Order Received") {
    icon.classList.add("status-order-received");
  } else if (selectedOption === "Processing") {
    icon.classList.add("status-processing");
  } else if (selectedOption === "Packed") {
    icon.classList.add("status-packed");
  } else if (selectedOption === "Shipped") {
    icon.classList.add("status-shipped");
  }
});

// Cập nhật màu icon khi trang tải, dựa trên trạng thái mặc định của dropdown
window.addEventListener("load", function () {
  var icon = document.getElementById("status-icon");
  var selectedOption = document.getElementById("order-status").value; // Lấy giá trị mặc định của option khi trang tải lên

  // Thêm lớp màu tương ứng cho trạng thái mặc định
  if (selectedOption === "Order Received") {
    icon.classList.add("status-order-received");
  } else if (selectedOption === "Processing") {
    icon.classList.add("status-processing");
  } else if (selectedOption === "Packed") {
    icon.classList.add("status-packed");
  } else if (selectedOption === "Shipped") {
    icon.classList.add("status-shipped");
  }
});
