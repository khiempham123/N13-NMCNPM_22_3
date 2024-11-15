const API_BASE_URL = "http://localhost:3000";
const booksContainer = document.getElementById("books-container");

async function fetchAndDisplayBooksByCategory() {
    const category = decodeURIComponent(window.location.pathname.split("/").pop()); // Giải mã tên category từ URL
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${category}`);
        const books = await response.json();

        booksContainer.innerHTML = ""; 

        books.forEach(book => {
            const bookItem = document.createElement("div");
            bookItem.classList.add("book-item");
            bookItem.innerHTML = `
                <h3>${book.Title}</h3>
                <p>${book.Description}</p>
                <p><strong>Price:</strong> $${book.Price}</p>
                <img src="${book.Thumbnail}" alt="${book.Title}" style="width: 100px; height: auto;">
            `;
            booksContainer.appendChild(bookItem);
        });
    } catch (error) {
        console.error("Error fetching books by category:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayBooksByCategory);
