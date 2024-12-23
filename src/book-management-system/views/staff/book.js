// Hàm lấy dữ liệu sách từ API
async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:3000/book/search");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Lấy toàn bộ object từ API
    console.log("Data from API:", data); // Kiểm tra cấu trúc dữ liệu
    console.log(data.books)

    renderBooks(data.books);

  } catch (error) {
    console.error("Error fetching books:", error);
    alert("Failed to load book data.");
  }
}

function renderBooks(books) {
  const bookRow = document.getElementById("bookRow");
  bookRow.innerHTML = ""; // Xóa nội dung cũ trước khi render mới
  console.log(bookRow);
  books.forEach((book) => {
    const bookBox = document.createElement("div");
    bookBox.classList.add("col-xl-3");
    bookBox.innerHTML = `
    
      <div class="book-box">
        <div class="book-image">
          <img src="${book.thumbnail || 'assets/images/popup.jpg'}" alt="${book.title}" />
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
    fetchBooks(); // Chỉ gọi hàm fetchBooks khi nhấn vào trang Books
  });
  // Mở popup Add Book
document.getElementById("openAddBookModal").addEventListener("click", function () {
  document.getElementById("addBookPopup").style.display = "flex";
});

// Đóng popup Add Book
document.getElementById("closeAddBookPopup").addEventListener("click", function () {
  document.getElementById("addBookPopup").style.display = "none";
});

// Xử lý SAVE - Thêm sách mới
document.getElementById("saveAddBookBtn").addEventListener("click", async () => {
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
    fetchBooks();
  } catch (error) {
    console.error("Error adding book:", error);
    alert("Failed to add book. Please try again.");
  }
});
  // Gắn sự kiện vào phần tử cha của các nút
  document.getElementById("bookRow").addEventListener("click", function (event) {

    const target = event.target; // Phần tử được click
    console.log(target)
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
    console.log(555)
    const bookId = target.dataset.id; // Lấy ID sách từ data-id
    deleteBookId = bookId; // Lưu ID sách cần xóa vào biến tạm
    const popup = document.getElementById("deleteBookPopup");
    
    popup.style.display = "flex" ;
    console.log(popup.style.display);
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
      console.log(book.data)
      // Điền dữ liệu vào input trong popup
      document.getElementById("editBookAuthor").value = book.data.author || "";
      document.getElementById("editBookPrice").value = book.data.price || "";
      document.getElementById("editBookStock").value = book.data.stock || "";
      document.getElementById("editBookCategory").value = book.data.category || "";
      document.getElementById("editBookPublisher").value = book.data.publisher || "";
      document.getElementById("editBookPublishDate").value =
  book.data.publishDate ? new Date(book.data.publishDate).toISOString().split("T")[0] : "";
      document.getElementById("editBookThumbnail").value = book.data.thumbnail || "";
      document.getElementById("editBookDescription").value =
        book.data.description || "";
      document.getElementById('addBookImage').src = book.data.thumbnail || 'assets/images/default.jpg';
      document.getElementById('addBookTitle').textContent = `Name: ${book.data.title || 'Unknown'}`;
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
      fetchBooks();
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
    document.getElementById("deleteBookBtn").addEventListener("click", async () => {
      if (!deleteBookId) return;
      console.log(deleteBookId)
      try {
        // Gửi yêu cầu xóa sách lên API
        const response = await fetch(`http://localhost:3000/book/${deleteBookId}`, {
          method: "DELETE",
        });
    
        if (!response.ok) throw new Error("Failed to delete book.");
    
        alert("Book deleted successfully!");
        document.getElementById("deleteBookPopup").style.display = "none"; // Đóng popup
    
        deleteBookId = null; // Reset biến lưu ID
        fetchBooks(); // Reload lại danh sách sách
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
});

