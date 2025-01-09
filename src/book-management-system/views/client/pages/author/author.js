const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  window.initializeProfileModals();
  async function fetchAuthors() {
    try {
      const response = await fetch(`${API_BASE_URL}/author`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const authors = await response.json();

      const authorListContainer = document.getElementById("author-list");
      authorListContainer.innerHTML = "";

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

        authorDiv.addEventListener("click", function () {
          showAuthorDetails(author._id);
        });
      });
    } catch (error) {
      console.error("Error fetching authors:", error);
      const authorListContainer = document.getElementById("author-list");
      authorListContainer.innerHTML =
        "<p>Failed to load authors. Please try again later.</p>";
    }
  }

  async function showAuthorDetails(authorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/author/${authorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const author = await response.json();

      document.getElementById("authorName").innerText = author.name;
      document.getElementById("authorBio").innerHTML = `<p>${author.bio.replace(
        /\n/g,
        "<br>"
      )}</p>`;

      const authorImage = document.getElementById("popupAuthorImage");
      authorImage.src =
        author.photo ||
        "https://cdn.24h.com.vn/upload/1-2021/images/2021-02-26/image50-1614333620-651-width500height800.jpg";
      authorImage.alt = author.name;

      const booksList = document.getElementById("authorBooks");
      booksList.innerHTML = "";

      if (author.books && author.books.length > 0) {
        author.books.forEach((book) => {
          const bookItem = document.createElement("li");
          bookItem.classList.add("col-xl-6");
          bookItem.innerHTML = `
            <i class="fa-regular fa-newspaper"></i>
            <span>${book.title}</span>
          `;
          bookItem.addEventListener("click", () => {
            window.location.href = `../detail/detail.html?id=${book._id}`;
          });

          booksList.appendChild(bookItem);
        });
      } else {
        booksList.innerHTML = "<li>No books available.</li>";
      }

      document.getElementById("authorPopup").style.display = "flex";
    } catch (error) {
      console.error("Error fetching author details:", error);
      alert("Failed to load author details. Please try again later.");
    }
  }

  document
    .getElementById("closeAuthorPopup")
    .addEventListener("click", function () {
      document.getElementById("authorPopup").style.display = "none";
    });

  window.addEventListener("click", function (event) {
    const popup = document.getElementById("authorPopup");
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });

  fetchAuthors();
});

document.addEventListener("DOMContentLoaded", () => {
  page = "author";
  window.setupPageWebSocket(page);
});
