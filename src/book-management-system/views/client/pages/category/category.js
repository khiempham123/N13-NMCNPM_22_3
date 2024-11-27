const API_BASE_URL = "http://localhost:3000";
const booksContainer = document.getElementById("books-container");

async function fetchAndDisplayBooksByCategory() {
    const url = new URL(window.location.href);
    const category = url.searchParams.get("category");
    console.log("Category:", category);
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${category}`);
        const books = await response.json();

        booksContainer.innerHTML = ""; 

        books.forEach(book => {
            const bookItem = document.createElement("div");
            bookItem.classList.add("book-item");
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>${book.description}</p>
                <p><strong>Price:</strong> $${book.price}</p>
                <img src="${book.thumbnail}" alt="${book.title}" style="width: 100px; height: auto;">
            `;
            booksContainer.appendChild(bookItem);
        });
    } catch (error) {
        console.error("Error fetching books by category:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayBooksByCategory);
