// Mở popup thêm sách
document
  .getElementById("openAddBookModal")
  .addEventListener("click", function () {
    document.getElementById("addBookPopup").style.display = "flex";
  });

// Đóng popup thêm sách
document
  .getElementById("closeAddBookPopup")
  .addEventListener("click", function () {
    document.getElementById("addBookPopup").style.display = "none";
  });

// Mở popup edit sách
document.getElementById("editBtn").addEventListener("click", function () {
  document.getElementById("editBookPopup").style.display = "flex";
});

// Đóng popup edit sách
document
  .getElementById("closeEditBookPopup")
  .addEventListener("click", function () {
    document.getElementById("editBookPopup").style.display = "none";
  });

// Mở popup delete sách
document.getElementById("deleteBtn").addEventListener("click", function () {
  document.getElementById("deleteBookPopup").style.display = "flex";
});

// Đóng popup delete sách
document
  .getElementById("closeDeleteBookPopup")
  .addEventListener("click", function () {
    document.getElementById("deleteBookPopup").style.display = "none";
  });

// Đảm bảo chỉ kích hoạt sự kiện submit khi nhấn nút tải lên
document
  .getElementById("ThumbnailForm")
  .addEventListener("click", function (e) {
    if (e.target !== document.getElementById("editBookThumbnail")) {
      e.preventDefault();
    }
  });
