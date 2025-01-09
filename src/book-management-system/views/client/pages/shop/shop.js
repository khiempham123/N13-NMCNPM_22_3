const carouselImages = document.getElementById("carouselImages");
const carouselButtons = document.getElementById("carouselButtons");
const totalSlides = document.querySelectorAll(".carousel-images img").length;

let currentIndex = 0;

const autoSlideInterval = 3000;
let interval = setInterval(nextSlide, autoSlideInterval);

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
}

function updateCarousel() {
  const offset = -currentIndex * 100;
  carouselImages.style.transform = `translateX(${offset}%)`;

  const buttons = document.querySelectorAll(".carousel-buttons button");
  buttons.forEach((button) => button.classList.remove("active"));
  buttons[currentIndex].classList.add("active");
}

for (let i = 0; i < totalSlides; i++) {
  const button = document.createElement("button");
  button.textContent = i + 1;
  button.dataset.index = i;
  button.addEventListener("click", () => {
    clearInterval(interval);
    currentIndex = i;
    updateCarousel();
    interval = setInterval(nextSlide, autoSlideInterval);
  });
  carouselButtons.appendChild(button);
}

updateCarousel();
const filterBtn = document.querySelector(".btn-filter");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

const priceRange = document.getElementById("priceRange");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const filterButton = document.querySelector(".filter-button");
priceRange.addEventListener("input", () => {
  const priceValue = priceRange.value;
  minPrice.textContent = priceValue;
  maxPrice.textContent = 100;
});
$(document).ready(function () {
  $("#priceRange").slider({
    range: true,
    min: 0,
    max: 100,
    values: [0, 100],
    slide: function (event, ui) {
      $("#range-value").text(
        "Price Range: $" + ui.values[0] + " - $" + ui.values[1]
      );

      $("#minPrice").val(ui.values[0]);
      $("#maxPrice").val(ui.values[1]);

      updateURL2();
    },
  });

  const defaultMin = $("#priceRange").slider("values", 0);
  const defaultMax = $("#priceRange").slider("values", 1);
  $("#range-value").text("Price Range: $" + defaultMin + " - $" + defaultMax);

  $("#minPrice").val(defaultMin);
  $("#maxPrice").val(defaultMax);

  $("input[name='category']").on("change", updateURL2);
  $("input[name='author']").on("change", updateURL2);

  $("#page-item").on("change", function () {
    updateURL2();
  });

  $("#filterButton").click(function () {
    updateURL2();
  });
});

filterButton.addEventListener("click", () => {
  const selectedMinPrice = minPrice.textContent;
  const selectedMaxPrice = maxPrice.textContent;
});

document.addEventListener("DOMContentLoaded", () => {
  window.initializeProfileModals();
});

function renderbooks(books) {
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";
  books.forEach((book) => {
    const bookHTML = `
            <div class="book-item">
            <div class="inner-box" onclick="goToBookDetail('${book._id}')">
            <div class="inner-image">
              <img src="${book.thumbnail}" alt="${book.title}">
              <div class="transaction trans-love" onclick="addToFav(event, '${
                book._id
              }', '${book.title}', '${book.thumbnail}', ${book.price}, ${
      book.rating
    })">
                <i class="fa-solid fa-heart" style="color: #ee2b3e;"></i>  
              </div>
              <div class="transaction trans-cart" onclick="addToCart(event, '${
                book._id
              }', '${book.title}', '${book.thumbnail}', ${book.price})">
                <i class="fa-solid fa-basket-shopping"></i>
              </div>
            </div>
            <div class="inner-content">
              <div class="inner-title">${book.title}</div>
              <div class="inner-author">${book.author}</div>
              <div class="rate" style="color: #ee2b3e;">
                ${getStarRating(book.rating)}
              </div>
              <div class="inner-price-new">
                ${(
                  book.price -
                  (book.price * book.percentDiscount) / 100
                ).toFixed(2)}
                <div class="inner-price-old">${book.price}</div>
              </div>
              <div class="inner-discount">${`-${book.percentDiscount}%`}</div>
            </div>
          </div>
            </div>
        `;
    bookList.innerHTML += bookHTML;
  });
}

function getStarRating(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push('<i class="fa-solid fa-star"></i>');
    } else {
      stars.push('<i class="fa-solid fa-star" style="color: #ccc;"></i>');
    }
  }
  return stars.join("");
}
function goToBookDetail(bookId) {
  window.location.href = `../detail/detail.html?id=${bookId}`;
}

async function addToFav(event, bookId, title, thumbnail, price, rating) {
  event.stopPropagation();

  try {
    const response = await fetch(`http://localhost:3000/add-to-fav`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        title,
        thumbnail,
        price,
        rating,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Sản phẩm đã được thêm vào danh sách yêu thích!");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error adding to fav:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm vào danh sách yêu thích.");
  }
}

async function addToCart(event, bookId, title, thumbnail, price) {
  event.stopPropagation();
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng.");
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/add-to-cart`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        title,
        thumbnail,
        price,
        quantity: 1,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } else {
      console.error(result.message);
      alert(result.message);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
  }
}

function fetchData() {
  fetch("http://localhost:3000/authors")
    .then((response) => response.json())
    .then((authors) => {
      const authorList = document.getElementById("author-list");
      authors.forEach((author) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = author.name;
        const label = document.createElement("label");
        label.setAttribute("for", author.name);
        label.textContent = author.name;
        li.appendChild(checkbox);
        li.appendChild(label);
        authorList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching authors:", error));

  fetch("http://localhost:3000/categories")
    .then((response) => response.json())
    .then((categories) => {
      const genreList = document.getElementById("genre-list");
      categories.forEach((category) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = category.id;
        const label = document.createElement("label");
        label.setAttribute("for", category.id);
        label.textContent = category.name; // Thể loại sách
        li.appendChild(checkbox);
        li.appendChild(label);
        genreList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));
}
function searchBooks() {
  const selectedAuthors = [];
  const selectedGenres = [];
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;
  const sortOption = document.querySelector(".sorting select").value;
  document
    .querySelectorAll('#author-list input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedAuthors.push(checkbox.id);
    });

  document
    .querySelectorAll('#genre-list input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedGenres.push(checkbox.id);
    });

  const params = new URLSearchParams();
  if (selectedAuthors.length)
    params.append("author", selectedAuthors.join(","));
  if (selectedGenres.length) params.append("genre", selectedGenres.join(","));
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (sortOption !== "Default sorting") params.append("sort", sortOption);

  params.append("page", 1);

  fetch(`http://localhost:3000/book/search?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      const bookList = document.getElementById("book-list");
      bookList.innerHTML = "";

      if (data.books.length > 0) {
        data.books.forEach((book) => {
          const bookDiv = document.createElement("div");
          bookDiv.classList.add("book");
          bookDiv.innerHTML = `
                  <div class="book-item">
                  <div class="inner-box" onclick="goToBookDetail('${
                    book._id
                  }')">
                  <div class="inner-image">
                    <img src="${book.thumbnail}" alt="${book.title}">
                    <div class="transaction trans-love" onclick="addToFav(event, '${
                      book._id
                    }', '${book.title}', '${book.thumbnail}', ${book.price}, ${
            book.rating
          })">
                      <i class="fa-solid fa-heart" style="color: #ee2b3e;"></i>  
                    </div>
                    <div class="transaction trans-cart" onclick="addToCart(event, '${
                      book._id
                    }', '${book.title}', '${book.thumbnail}', ${book.price})">
                      <i class="fa-solid fa-basket-shopping"></i>
                    </div>
                  </div>
                  <div class="inner-content">
                    <div class="inner-title">${book.title}</div>
                    <div class="inner-author">${book.author}</div>
                    <div class="rate" style="color: #ee2b3e;">
                      ${getStarRating(book.rating)}
                    </div>
                    <div class="inner-price-new">
                      ${(
                        book.price -
                        (book.price * book.percentDiscount) / 100
                      ).toFixed(2)}
                      <div class="inner-price-old">${book.price}</div>
                    </div>
                    <div class="inner-discount">${`-${book.percentDiscount}%`}</div>
                  </div>
                </div>
              </div>
              `;
          bookList.appendChild(bookDiv);
        });
        currentPage = 1;
      } else {
        bookList.innerHTML = "<p>No books found matching your criteria.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
      const bookList = document.getElementById("book-list");
      bookList.innerHTML =
        "<p>Something went wrong. Please try again later.</p>";
    });
}
document.addEventListener("DOMContentLoaded", fetchData);
const searchButton = document.querySelector(".filter-button");
searchButton.addEventListener("click", searchBooks);
searchButton.addEventListener("click", updateURL2);
searchButton.addEventListener("click", () => fetchbooks(1));
function updateURL2() {
  const urlParams = new URLSearchParams(window.location.search);
  const author = [];
  const genre = [];
  document
    .querySelectorAll('#author-list input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      author.push(checkbox.id);
    });

  document
    .querySelectorAll('#genre-list input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      genre.push(checkbox.id);
    });
  const minPrice = $("#minPrice").val();
  const maxPrice = $("#maxPrice").val();
  const page = currentPage;

  if (genre) urlParams.set("genre", genre);
  if (author) urlParams.set("author", author);
  if (minPrice) urlParams.set("minPrice", minPrice);
  if (maxPrice) urlParams.set("maxPrice", maxPrice);
  urlParams.set("page", page);

  window.history.pushState({}, "", "?" + urlParams.toString());
}

const BASE_URL = "http://localhost:3000/book";
const LIMIT = 20;
let currentPage = 1;
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pageFromURL = parseInt(urlParams.get("page"));

  if (!isNaN(pageFromURL)) {
    currentPage = 1;

    history.replaceState(null, "", window.location.pathname);
  }

  await fetchbooks(currentPage);
});

async function fetchbooks(page) {
  const urlParams = new URLSearchParams(window.location.search);
  const genre = urlParams.get("genre") || "";
  const author = urlParams.get("author") || "";
  const minPrice = urlParams.get("minPrice") || "";
  const maxPrice = urlParams.get("maxPrice") || "";
  const sortOption =
    document.querySelector(".sorting select").value || "Default sorting";
  document.getElementById("spinner-container").style.display = "flex";

  setTimeout(() => {
    document.getElementById("spinner-container").style.display = "none";
  }, 500);
  try {
    const queryParams = new URLSearchParams({
      author,
      genre,
      minPrice,
      maxPrice,
      page,
      sort: sortOption !== "Default sorting" ? sortOption : "",
    });

    const response = await fetch(
      `http://localhost:3000/book/search?${queryParams}`
    );
    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (data.totalPages === 0) {
      document.getElementById("book-list").innerHTML =
        '<p class="centered-text">Không có sách phù hợp</p>';
      document.getElementById("pagination-list").innerHTML = "";
    } else {
      renderbooks(data.books);
      renderPagination(data.totalPages, page);
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination-list");
  paginationContainer.innerHTML = "";
  const prevButton = document.createElement("button");
  prevButton.textContent = "<";
  prevButton.classList.add("pagination-button");
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateURL(currentPage);
      window.scrollTo(0, 0);
      fetchbooks(currentPage);
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("pagination-button");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pageButton.addEventListener("click", () => {
      currentPage = i;
      updateURL(currentPage);
      window.scrollTo(0, 0);
      fetchbooks(currentPage);
    });

    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = ">";
  nextButton.classList.add("pagination-button");
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateURL(currentPage);
      window.scrollTo(0, 0);
      fetchbooks(currentPage);
    }
  });
  paginationContainer.appendChild(nextButton);
}
function updateURL(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  history.pushState({}, "", url);
}
const sortSelect = document.querySelector(".sorting select");

sortSelect.addEventListener("change", () => {
  const currentPage = getCurrentPageFromURL();
  fetchbooks(currentPage);
});
function getCurrentPageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page");
  return page ? parseInt(page) : 1;
}

document.addEventListener("DOMContentLoaded", () => {
  page = "book";
  window.setupPageWebSocket(page);
});
