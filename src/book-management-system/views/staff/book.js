let currentPage = 1;
async function fetchBooks(page = 1) {
  try {
    const response = await fetch(`http://localhost:3000/book/?page=${page}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    renderBooks(data.books);
    renderPagination(data.totalPages, page);
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
  paginationList.innerHTML = "";

  const prevButton = document.createElement("li");
  prevButton.innerHTML = `<a href="#topBook"><span><i class="fa-solid fa-chevron-left"></i></span></a>`;
  if (currentPage === 1) prevButton.classList.add("disabled");
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchBooks(currentPage - 1);
    }
  });
  paginationList.appendChild(prevButton);

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
  bookRow.innerHTML = "";
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
    fetchBooks(currentPage);
  });
  document
    .getElementById("openAddBookModal")
    .addEventListener("click", function () {
      document.getElementById("addBookPopup").style.display = "flex";
    });

  document
    .getElementById("closeAddBookPopup")
    .addEventListener("click", function () {
      document.getElementById("addBookPopup").style.display = "none";
    });

  document
    .getElementById("saveAddBookBtn")
    .addEventListener("click", async () => {
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
        const response = await fetch("http://localhost:3000/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBook),
        });

        if (!response.ok) throw new Error("Failed to add new book.");

        alert("Book added successfully!");

        document.getElementById("addBookPopup").style.display = "none";

        fetchBooks(currentPage);
      } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book. Please try again.");
      }
    });
  document
    .getElementById("editBookThumbnailFile")
    .addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const uploadedImageUrl = await uploadImageWithSignature(file);
        document.getElementById("addBookImage").src = uploadedImageUrl;
        document.getElementById("editBookThumbnail").value = uploadedImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    });
  document
    .getElementById("addBookThumbnailFile")
    .addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const uploadedImageUrl = await uploadImageWithSignature(file);

        document.getElementById("addBookImagePreview").src = uploadedImageUrl;

        document.getElementById("addBookThumbnail").value = uploadedImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    });
  document
    .getElementById("bookRow")
    .addEventListener("click", function (event) {
      const target = event.target;
      if (target.classList.contains("editBtn")) {
        const bookId = target.dataset.id;
        fetchBookById(bookId);
        const editPopup = document.getElementById("editBookPopup");
        editPopup.scrollTop = 0;
        return;
      }

      if (target.classList.contains("deleteBtn")) {
        const bookId = target.dataset.id;
        deleteBookId = bookId;
        const popup = document.getElementById("deleteBookPopup");

        popup.style.display = "flex";
        document.getElementById("editBookPopup").style.display = "none";
        return;
      }
    });

  async function fetchBookById(bookId) {
    try {
      const response = await fetch(`http://localhost:3000/book/${bookId}`);
      if (!response.ok) throw new Error("Failed to fetch book details.");

      const book = await response.json();
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
      document.getElementById("saveEditBtn").dataset.id = bookId;

      const popup = document.getElementById("editBookPopup");
      popup.scrollTop = 0;
      popup.style.display = "flex";
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  }

  document.getElementById("saveEditBtn").addEventListener("click", async () => {
    const bookId = document.getElementById("saveEditBtn").dataset.id;

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

      document.getElementById("editBookPopup").style.display = "none";

      fetchBooks(currentPage);
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    }
  });

  document
    .getElementById("closeEditBookPopup")
    .addEventListener("click", function () {
      document.getElementById("editBookPopup").style.display = "none";
    });
  let deleteBookId = null;

  document
    .getElementById("deleteBookBtn")
    .addEventListener("click", async () => {
      if (!deleteBookId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/book/${deleteBookId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete book.");

        alert("Book deleted successfully!");
        document.getElementById("deleteBookPopup").style.display = "none";

        deleteBookId = null;
        fetchBooks(currentPage);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book. Please try again.");
      }
    });

  document
    .getElementById("closeDeleteBookPopup")
    .addEventListener("click", () => {
      document.getElementById("deleteBookPopup").style.display = "none";
      deleteBookId = null;
    });

  const searchInput = document.getElementById("searchBookInput");
  const suggestionBox = document.getElementById("bookSuggestionBox");

  function renderSuggestions(books) {
    suggestionBox.innerHTML = "";

    books.slice(0, 5).forEach((book) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = `${book.title} (${book.author})`;
      suggestionBox.appendChild(suggestionItem);

      suggestionItem.addEventListener("click", () => {
        searchInput.value = book.title;
        suggestionBox.innerHTML = "";
      });
    });

    suggestionBox.style.display = books.length > 0 ? "block" : "none";
  }

  async function searchBooks(query) {
    try {
      const response = await fetch(
        `http://localhost:3000/books/searchbar?query=${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");
      const books = await response.json();
      renderSuggestions(books);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  }

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim();
    if (query.length > 0) {
      searchBooks(query);
    } else {
      suggestionBox.innerHTML = "";
      suggestionBox.style.display = "none";
    }
  });

  document.addEventListener("click", (event) => {
    if (!suggestionBox.contains(event.target) && event.target !== searchInput) {
      suggestionBox.style.display = "none";
    }
  });
});
