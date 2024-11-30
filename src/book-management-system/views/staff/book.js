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
