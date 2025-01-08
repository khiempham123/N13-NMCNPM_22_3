let currentPage = 1;
// Hàm lấy dữ liệu sách từ API
async function fetchBooks(page = 1) {
  try {
    const response = await fetch(`http://localhost:3000/book/?page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Lấy dữ liệu từ API
    renderBooks(data.books); // Hiển thị sách
    renderPagination(data.totalPages, page); // Hiển thị phân trang
  } catch (error) {
    console.error("Error fetching books:", error);
    alert("Failed to load book data.");
  }
}
function renderPagination(totalPages, currentPage) {
  const paginationList = document.getElementById("bookpagination-list");
  if (!paginationList) {
    console.error("Element with id 'bookpagination-list' not found.");
    return;
  }
  paginationList.innerHTML = ""; // Xóa nội dung cũ

  // Nút "Previous"
  const prevButton = document.createElement("li");
  prevButton.innerHTML = `<a href="#topBook"><span><i class="fa-solid fa-chevron-left"></i></span></a>`;
  if (currentPage === 1) prevButton.classList.add("disabled");
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchBooks(currentPage - 1);
    }
  });
  paginationList.appendChild(prevButton);

  // Số trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("li");
    if (currentPage === i) {
      pageButton.classList.add("current");
    }
    pageButton.innerHTML = `<a href="#topBook"><span>${i}</span></a>`;
    pageButton.addEventListener("click", () => {
      if (currentPage !== i) {
        fetchBooks(i);
      }
    });
    paginationList.appendChild(pageButton);
  }

  // Nút "Next"
  const nextButton = document.createElement("li");
  nextButton.innerHTML = `<a href="#topBook"><span><i class="fa-solid fa-chevron-right"></i></span></a>`;
  if (currentPage === totalPages) nextButton.classList.add("disabled");
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      fetchBooks(currentPage + 1);
    }
  });
  paginationList.appendChild(nextButton);
}
function renderBooks(books) {
  const bookRow = document.getElementById("bookRow");
  bookRow.innerHTML = ""; // Xóa nội dung cũ trước khi render mới
  books.forEach((book) => {
    const bookBox = document.createElement("div");
    bookBox.classList.add("col-xl-3");
    bookBox.innerHTML = `
    
      <div class="book-box">
        <div class="book-image">
          <img src="${book.thumbnail || "assets/images/popup.jpg"}" alt="${
      book.title
    }" />
        </div>
        <div class="book-content">
          <h4>${book.title}</h4>
          <p>Author: ${book.author}</p>
          <p>Price: $${book.price}</p>
          <p>Quantity: ${book.stock}</p>
          <button class="editBtn" data-id="${book._id}">Edit</button>
          <button class="deleteBtn" data-id="${book._id}">Delete</button>
        </div>
      </div>
    `;
    bookRow.appendChild(bookBox);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("book").addEventListener("click", () => {
    fetchBooks(currentPage); // Chỉ gọi hàm fetchBooks khi nhấn vào trang Books
  });
  // Mở popup Add Book
  document
    .getElementById("openAddBookModal")
    .addEventListener("click", function () {
      document.getElementById("addBookPopup").style.display = "flex";
    });

  // Đóng popup Add Book
  document
    .getElementById("closeAddBookPopup")
    .addEventListener("click", function () {
      document.getElementById("addBookPopup").style.display = "none";
    });

  // Xử lý SAVE - Thêm sách mới
  document
    .getElementById("saveAddBookBtn")
    .addEventListener("click", async () => {
      // Lấy dữ liệu từ input
      const newBook = {
        title: document.getElementById("addBookName").value,
        author: document.getElementById("addBookAuthor").value,
        price: document.getElementById("addBookPrice").value,
        stock: document.getElementById("addBookStock").value,
        category: document.getElementById("addBookCategory").value,
        publisher: document.getElementById("addBookPublisher").value,
        publishDate: document.getElementById("addBookPublishDate").value,
        thumbnail: document.getElementById("addBookThumbnail").value,
        description: document.getElementById("addBookDescription").value,
      };

      try {
        // Gửi yêu cầu POST lên server
        const response = await fetch("http://localhost:3000/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBook),
        });

        if (!response.ok) throw new Error("Failed to add new book.");

        alert("Book added successfully!");

        // Đóng popup sau khi thêm thành công
        document.getElementById("addBookPopup").style.display = "none";

        // Reload lại danh sách sách
        fetchBooks(currentPage);
      } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book. Please try again.");
      }
    });
  document
    .getElementById("editBookThumbnailFile")
    .addEventListener("change", async (event) => {
      const file = event.target.files[0]; // Lấy file được chọn
      if (!file) return;

      try {
        const uploadedImageUrl = await uploadImageWithSignature(file); // Gọi hàm tải file
        // Cập nhật preview ảnh
        document.getElementById("addBookImage").src = uploadedImageUrl;
        // Cập nhật giá trị vào input thumbnail
        document.getElementById("editBookThumbnail").value = uploadedImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    });
  document
    .getElementById("addBookThumbnailFile")
    .addEventListener("change", async (event) => {
      const file = event.target.files[0]; // Lấy file được chọn
      if (!file) return;

      try {
        const uploadedImageUrl = await uploadImageWithSignature(file); // Gọi hàm upload ảnh

        // Cập nhật preview ảnh
        document.getElementById("addBookImagePreview").src = uploadedImageUrl;

        // Cập nhật giá trị vào input thumbnail
        document.getElementById("addBookThumbnail").value = uploadedImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    });
  // Gắn sự kiện vào phần tử cha của các nút
  document
    .getElementById("bookRow")
    .addEventListener("click", function (event) {
      const target = event.target; // Phần tử được click
      // Kiểm tra nút Edit
      if (target.classList.contains("editBtn")) {
        const bookId = target.dataset.id; // Lấy ID sách từ data-id
        fetchBookById(bookId); // Hiển thị popup Edit
        const editPopup = document.getElementById("editBookPopup");
        editPopup.scrollTop = 0;
        return;
      }

      // Kiểm tra nút Delete
      if (target.classList.contains("deleteBtn")) {
        const bookId = target.dataset.id; // Lấy ID sách từ data-id
        deleteBookId = bookId; // Lưu ID sách cần xóa vào biến tạm
        const popup = document.getElementById("deleteBookPopup");

        popup.style.display = "flex";
        document.getElementById("editBookPopup").style.display = "none";
        return;
      }
    });

  // Hàm fetch thông tin sách theo ID và hiển thị trong popup
  async function fetchBookById(bookId) {
    try {
      const response = await fetch(`http://localhost:3000/book/${bookId}`);
      if (!response.ok) throw new Error("Failed to fetch book details.");

      const book = await response.json();
      // Điền dữ liệu vào input trong popup
      document.getElementById("editBookAuthor").value = book.data.author || "";
      document.getElementById("editBookPrice").value = book.data.price || "";
      document.getElementById("editBookStock").value = book.data.stock || "";
      document.getElementById("editBookCategory").value =
        book.data.category || "";
      document.getElementById("editBookPublisher").value =
        book.data.publisher || "";
      document.getElementById("editBookPublishDate").value = book.data
        .publishDate
        ? new Date(book.data.publishDate).toISOString().split("T")[0]
        : "";
      document.getElementById("editBookThumbnail").value =
        book.data.thumbnail || "";
      document.getElementById("editBookDescription").value =
        book.data.description || "";
      document.getElementById("addBookImage").src =
        book.data.thumbnail || "assets/images/default.jpg";
      document.getElementById("addBookTitle").textContent = `Name: ${
        book.data.title || "Unknown"
      }`;
      // Gắn ID sách vào nút SAVE để sử dụng khi cập nhật
      document.getElementById("saveEditBtn").dataset.id = bookId;

      // Hiển thị popup

      const popup = document.getElementById("editBookPopup"); // Lấy popup theo ID
      popup.scrollTop = 0;
      popup.style.display = "flex"; // Hiển thị popup
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  }

  // Xử lý SAVE để gửi dữ liệu cập nhật lên server
  document.getElementById("saveEditBtn").addEventListener("click", async () => {
    const bookId = document.getElementById("saveEditBtn").dataset.id;

    // Thu thập dữ liệu từ input
    const updatedBook = {
      author: document.getElementById("editBookAuthor").value,
      price: document.getElementById("editBookPrice").value,
      stock: document.getElementById("editBookStock").value,
      category: document.getElementById("editBookCategory").value,
      publisher: document.getElementById("editBookPublisher").value,
      publishDate: document.getElementById("editBookPublishDate").value,
      thumbnail: document.getElementById("editBookThumbnail").value,
      description: document.getElementById("editBookDescription").value,
    };

    try {
      const response = await fetch(`http://localhost:3000/book/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) throw new Error("Failed to update book.");

      alert("Book updated successfully!");

      // Đóng popup sau khi cập nhật thành công
      document.getElementById("editBookPopup").style.display = "none";

      // Reload lại danh sách sách
      fetchBooks(currentPage);
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    }
  });

  // Xử lý nút CLOSE
  document
    .getElementById("closeEditBookPopup")
    .addEventListener("click", function () {
      document.getElementById("editBookPopup").style.display = "none";
    });
  let deleteBookId = null; // Biến tạm lưu ID của sách cần xóa

  // Xử lý sự kiện khi nhấn YES (Xác nhận xóa)
  document
    .getElementById("deleteBookBtn")
    .addEventListener("click", async () => {
      if (!deleteBookId) return;
      try {
        // Gửi yêu cầu xóa sách lên API
        const response = await fetch(
          `http://localhost:3000/book/${deleteBookId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete book.");

        alert("Book deleted successfully!");
        document.getElementById("deleteBookPopup").style.display = "none"; // Đóng popup

        deleteBookId = null; // Reset biến lưu ID
        fetchBooks(currentPage); // Reload lại danh sách sách
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book. Please try again.");
      }
    });

  // Xử lý sự kiện khi nhấn NO (Đóng popup)
  document
    .getElementById("closeDeleteBookPopup")
    .addEventListener("click", () => {
      document.getElementById("deleteBookPopup").style.display = "none";
      deleteBookId = null; // Reset biến tạm
    });

  const searchInput = document.getElementById("searchBookInput");
  const suggestionBox = document.getElementById("bookSuggestionBox");

  // Hàm hiển thị danh sách sách gợi ý
  function renderSuggestions(books) {
    suggestionBox.innerHTML = ""; // Xóa nội dung cũ

    books.slice(0, 5).forEach((book) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = `${book.title} (${book.author})`;
      suggestionBox.appendChild(suggestionItem);

      // Gắn sự kiện khi chọn một đề xuất
      suggestionItem.addEventListener("click", () => {
        searchInput.value = book.title; // Gán giá trị vào ô input
        suggestionBox.innerHTML = ""; // Xóa danh sách gợi ý
      });
    });

    // Hiển thị container nếu có kết quả
    suggestionBox.style.display = books.length > 0 ? "block" : "none";
  }

  // Hàm gửi yêu cầu tìm kiếm
  async function searchBooks(query) {
    try {
      const response = await fetch(
        `http://localhost:3000/books/searchbar?query=${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");
      const books = await response.json();
      renderSuggestions(books); // Cập nhật container kết quả
    } catch (error) {
      console.error("Error searching books:", error);
    }
  }

  // Sự kiện khi nhập vào ô tìm kiếm
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim();
    if (query.length > 0) {
      searchBooks(query);
    } else {
      suggestionBox.innerHTML = ""; // Xóa kết quả nếu không có từ khóa
      suggestionBox.style.display = "none";
    }
  });

  // Đóng suggestion box khi click ra ngoài
  document.addEventListener("click", (event) => {
    if (!suggestionBox.contains(event.target) && event.target !== searchInput) {
      suggestionBox.style.display = "none";
    }
  });
});
