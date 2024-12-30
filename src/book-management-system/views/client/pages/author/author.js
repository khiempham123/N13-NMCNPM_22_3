const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  window.initializeProfileModals();
  // Function to fetch and display authors
  async function fetchAuthors() {
    try {
      // Fetch authors from the API
      const response = await fetch(`${API_BASE_URL}/author`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const authors = await response.json();

      // Get the author list container
      const authorListContainer = document.getElementById("author-list");
      authorListContainer.innerHTML = ""; // Clear any existing content

      // Loop through authors and create HTML elements
      authors.forEach((author) => {
        const authorDiv = document.createElement("div");
        authorDiv.classList.add("col-xl-3");

        authorDiv.innerHTML = `
          <div class="author" data-id="${author._id}" style="cursor: pointer;">
            <img src="${
              author.photo ||
              "https://cdn.24h.com.vn/upload/1-2021/images/2021-02-26/image50-1614333620-651-width500height800.jpg"
            }" alt="${author.name}">
            <div class="author-name">${author.name}</div>
          </div>
        `;

        authorListContainer.appendChild(authorDiv);

        // Add click event to show author details
        authorDiv.addEventListener("click", function () {
          showAuthorDetails(author._id);
        });
      });
    } catch (error) {
      console.error("Error fetching authors:", error);
      // Optionally, display an error message to the user
      const authorListContainer = document.getElementById("author-list");
      authorListContainer.innerHTML =
        "<p>Failed to load authors. Please try again later.</p>";
    }
  }

  // Function to show author details in popup
  async function showAuthorDetails(authorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/author/${authorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const author = await response.json();

      // Update popup content
      document.getElementById("authorName").innerText = author.name;
      document.getElementById("authorBio").innerHTML = `<p>${author.bio.replace(
        /\n/g,
        "<br>"
      )}</p>`;

      // Update author image
      const authorImage = document.getElementById("popupAuthorImage");
      authorImage.src =
        author.photo ||
        "https://cdn.24h.com.vn/upload/1-2021/images/2021-02-26/image50-1614333620-651-width500height800.jpg";
      authorImage.alt = author.name;

      // Populate books
      const booksList = document.getElementById("authorBooks");
      booksList.innerHTML = ""; // Clear existing books

      if (author.books && author.books.length > 0) {
        author.books.forEach((book) => {
          const bookItem = document.createElement("li");
          bookItem.classList.add("col-xl-6");
          bookItem.innerHTML = `
            <i class="fa-regular fa-newspaper"></i>
            <span>${book.title}</span>
          `;
          // click to detail
          bookItem.addEventListener("click", () => {
            window.location.href = `../detail/detail.html?id=${book._id}`; // Assuming the book ID is part of the URL
          });

          booksList.appendChild(bookItem);
        });
      } else {
        booksList.innerHTML = "<li>No books available.</li>";
      }

      // Show the popup
      document.getElementById("authorPopup").style.display = "flex";
    } catch (error) {
      console.error("Error fetching author details:", error);
      // Optionally, display an error message to the user
      alert("Failed to load author details. Please try again later.");
    }
  }

  // Close popup when close button is clicked
  document
    .getElementById("closeAuthorPopup")
    .addEventListener("click", function () {
      document.getElementById("authorPopup").style.display = "none";
    });

  // Optional: Close popup when clicking outside the popup content
  window.addEventListener("click", function (event) {
    const popup = document.getElementById("authorPopup");
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });

  // Fetch authors on page load
  fetchAuthors();

  




});

document.addEventListener("DOMContentLoaded", () => {
  page = "author";
  window.setupPageWebSocket(page)
});

