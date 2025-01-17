const API_BASE_URL = "http://localhost:3000";

const searchInput = document.querySelector(".form-control[type='search']");
const categoriesDropdown = document.getElementById("categories-dropdown");
const resultsContainer = document.getElementById("results-container");
const loadingIndicator = document.getElementById("loading");

async function fetchAndDisplayFilteredBooks(category) {
  const query = searchInput.value.trim();

  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (category) params.append("category", category);

  try {
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
    }

    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }

    displaySearchResults(books);
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
    resultsContainer.innerHTML = `<p style="color: red;">Error fetching results. Please try again later.</p>`;
  }
}

function displaySearchResults(books) {
  resultsContainer.innerHTML = "";

  if (books.length === 0) {
    resultsContainer.classList.add("empty");
    resultsContainer.innerHTML = `<p>No books found matching your criteria.</p>`;
    hideSearchResults();
    return;
  } else {
    resultsContainer.classList.remove("empty");
  }

  const resultsList = document.createElement("div");
  resultsList.classList.add("search-results-list");

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.className = "search-result-item";

    bookItem.innerHTML = `
            <a href="../detail/detail.html?id=${book._id}" class="book-link">
                <img src="${book.thumbnail}" alt="${
      book.title
    }" class="book-image">
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <p><strong>Author:</strong> ${book.author || "Unknown"}</p>
                    <p class="book-price"><i class="fa-solid fa-dollar-sign"></i>${book.price.toFixed(
                      2
                    )}</p>
                </div>
            </a>
        `;

    resultsList.appendChild(bookItem);
  });

  resultsContainer.appendChild(resultsList);

  showSearchResults();
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const categories = await response.json();

    categoriesDropdown.innerHTML = "";

    const allItem = document.createElement("li");
    allItem.innerHTML = `
            <a class="dropdown-item" href="#" data-category="">
                All Category
            </a>
        `;
    categoriesDropdown.appendChild(allItem);

    categories.forEach((category) => {
      const categoryItem = document.createElement("li");
      categoryItem.innerHTML = `
                <a class="dropdown-item" href="#" data-category="${category.name}">
                    ${category.name}
                </a>
            `;
      categoriesDropdown.appendChild(categoryItem);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

categoriesDropdown.addEventListener("click", (event) => {
  event.preventDefault();
  const categoryElement = event.target.closest("a");
  if (categoryElement) {
    const category = categoryElement.getAttribute("data-category");
    document
      .querySelectorAll("#categories-dropdown .dropdown-item")
      .forEach((item) => {
        item.classList.remove("active-category");
      });
    categoryElement.classList.add("active-category");
    fetchAndDisplayFilteredBooks(category);
  }
});

searchInput.addEventListener("input", () => {
  const activeCategory = categoriesDropdown.querySelector(".active-category");
  const category = activeCategory
    ? activeCategory.getAttribute("data-category")
    : "";
  fetchAndDisplayFilteredBooks(category);
});

function hideSearchResults() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.classList.remove("show");
}

function showSearchResults() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.classList.add("show");
}

document.addEventListener("click", (event) => {
  const searchContainer = document.querySelector(".form-control");
  const resultsContainer = document.getElementById("results-container");

  if (
    !searchContainer.contains(event.target) &&
    !resultsContainer.contains(event.target)
  ) {
    hideSearchResults();
  }
});

async function fetchTopCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/top-categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch top categories");
    }
    const categories = await response.json();

    const container = document.querySelector(".container");
    if (!container) return;

    const divs = container.querySelectorAll(".topseller-item");

    categories.forEach((category, index) => {
      if (index < divs.length) {
        const link = divs[index];
        link.setAttribute("title", category._id);

        const caption = link.querySelector(".product-caption");
        if (caption) {
          caption.innerHTML = `
                        <div class="caption-title"><span>${category._id}</span></div>
                        <div class="caption-total"><span>${category.count} products</span></div>
                    `;
        }

        link.addEventListener("click", () => {
          window.location.href = `../shop/shop.html?genre=${category._id}`;
        });
      }
    });
  } catch (error) {
    console.error("Error fetching top categories:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCategories();

  const allCategory = categoriesDropdown.querySelector(
    '.dropdown-item[data-category=""]'
  );
  if (allCategory) {
    allCategory.classList.add("active-category");
  }

  fetchTopCategories();
});

document.addEventListener("DOMContentLoaded", function () {
  const dealsContainer = document.getElementById("deals-of-the-week");
  const countdownDisplay = document.getElementById("countdown");

  fetch(`${API_BASE_URL}/deals-of-the-week`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        
        dealsContainer.innerHTML = "<p>No deals available this week.</p>";
        countdownDisplay.textContent = "00:00:00:00";
        return;
      }
      const endDates = data.map((deal) => new Date(deal.endDate));
      const earliestEndDate = new Date(Math.min(...endDates));
      startCountdown(earliestEndDate, countdownDisplay);

      for (let i = 0; i < data.length; i += 2) {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";

        const dealPair = data.slice(i, i + 2);
        dealPair.forEach((deal, index) => {
          const dealItem = document.createElement("div");
          dealItem.classList.add("deal-item");
          dealItem.style.cursor = "pointer";
          dealItem.setAttribute("data-id", deal._id);

          dealItem.addEventListener("click", function () {
            window.location.href = `../detail/detail.html?id=${deal._id}`;
          });

          const img = document.createElement("img");
          img.src = deal.thumbnail;
          img.alt = deal.dealDescription || `Book cover of ${deal.title}`;
          dealItem.appendChild(img);

          const dealInfo = document.createElement("div");
          dealInfo.classList.add("deal-info");

          const title = document.createElement("h2");
          title.textContent = deal.title;
          dealInfo.appendChild(title);

          const author = document.createElement("p");
          author.textContent = deal.author;
          dealInfo.appendChild(author);

          const price = document.createElement("p");
          price.classList.add("price");
          price.innerHTML = `
                        <i class="fa-solid fa-dollar-sign"></i>${deal.discountPrice.toFixed(
                          2
                        )}
                        <span class="old-price"><i class="fa-solid fa-dollar-sign"></i>${deal.originalPrice.toFixed(
                          2
                        )}</span>
                    `;
          dealInfo.appendChild(price);

          const sold = document.createElement("p");
          sold.classList.add("sold");
          sold.textContent = `Already sold: ${deal.soldCount}/${deal.maxQuantity}`;
          dealInfo.appendChild(sold);

          const progress = document.createElement("div");
          progress.classList.add("progress");
          const progressBar = document.createElement("div");
          progressBar.classList.add("progress-bar");
          progressBar.style.width = `${
            (deal.soldCount / deal.maxQuantity) * 100
          }%`;
          progress.appendChild(progressBar);
          progressBar.style.backgroundColor = "#FF4500";
          dealInfo.appendChild(progress);

          dealItem.appendChild(dealInfo);

          if (index === 0 && dealPair.length > 1) {
            const divider = document.createElement("div");
            divider.style.width = "1px";
            divider.style.backgroundColor = "#b3b3b3";
            divider.style.marginLeft = "20px";
            divider.style.marginRight = "20px";
            dealItem.appendChild(divider);
          }

          row.appendChild(dealItem);
        });

        dealsContainer.appendChild(row);

        if (i + 2 < data.length) {
          const horizontalDivider = document.createElement("div");
          horizontalDivider.style.borderBottom = "1px solid #FF4500";
          horizontalDivider.style.marginBottom = "20px";
          dealsContainer.appendChild(horizontalDivider);
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching deals:", error);
      dealsContainer.innerHTML =
        "<p>Error loading deals. Please try again later.</p>";
      countdownDisplay.textContent = "00:00:00:00";
    });

  /**
   * Hàm khởi động countdown timer
   * @param {Date} endDate - Ngày kết thúc của deal
   * @param {HTMLElement} display - Phần tử hiển thị countdown
   */
  function startCountdown(endDate, display) {
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        display.textContent = "00:00:00:00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      display.textContent =
        `${String(days).padStart(2, "0")}:` +
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
    }

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.querySelector(".user-icon");
  const loggedOutProfile = document.querySelector("#logged-out-profile");
  const loggedInProfile = document.querySelector("#logged-in-profile");
  const closeBtns = document.querySelectorAll(".close-btn");

  const token = localStorage.getItem("token");
  loggedOutProfile.style.display = "none";
  loggedInProfile.style.display = "none";

  const toggleProfileModal = () => {
    if (token) {
      loggedInProfile.style.display =
        loggedInProfile.style.display === "none" ||
        loggedInProfile.style.display === ""
          ? "flex"
          : "none";
      loggedOutProfile.style.display = "none";
    } else {
      loggedOutProfile.style.display =
        loggedOutProfile.style.display === "none" ||
        loggedOutProfile.style.display === ""
          ? "flex"
          : "none";
      loggedInProfile.style.display = "none";
    }
  };

  userIcon.addEventListener("click", (event) => {
    event.preventDefault();
    toggleProfileModal();
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      loggedOutProfile.style.display = "none";
      loggedInProfile.style.display = "none";
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !loggedOutProfile.contains(event.target) &&
      !loggedInProfile.contains(event.target) &&
      !userIcon.contains(event.target)
    ) {
      loggedOutProfile.style.display = "none";
      loggedInProfile.style.display = "none";
    }
  });
});

async function loadBestSellers() {
  try {
    const response = await fetch(`${API_BASE_URL}/best-seller`);
    const books = await response.json();

    const booksContainer = document.querySelector(
      ".section-three .container .row"
    );

    booksContainer.innerHTML = "";

    books.forEach((book) => {
      const bookHTML = `
        <div class="col-lg-3 col-md-4 col-sm-6 col-12">
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

      booksContainer.innerHTML += bookHTML;
    });
  } catch (error) {
    console.error("Error loading best sellers:", error);
  }
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
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Thêm vào giỏ hàng thất bại. Đăng nhập và thử lại.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/add-to-fav`, {
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
    alert("Thêm vào giỏ hàng thất bại. Đăng nhập và thử lại.");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
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

document.addEventListener("DOMContentLoaded", loadBestSellers);

async function fetchVendors() {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor`);
    const vendors = await response.json();

    const vendorList = document.getElementById("vendor-list");
    vendors.forEach((vendor) => {
      const vendorItem = document.createElement("div");
      vendorItem.classList.add("vendor-item");
      vendorItem.innerHTML = `
        <img alt="Logo of ${vendor.vendor}"
            src="${vendor.thumbnail}"
            width="100" />
        <div class="vendor-info">
            <h3>
                ${vendor.vendor} <span>(${vendor.books.length} Products)</span>
            </h3>
            <div class="rating">
                ${renderStars(vendor.rating)}
            </div>
        </div>
      `;

      vendorItem.addEventListener("click", () => {
        window.location.href = `../Vendor/vendor.html?vendorName=${encodeURIComponent(
          vendor.vendor
        )}`;
      });

      vendorList.appendChild(vendorItem);
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }
}

function renderStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i < Math.floor(rating) + 0.5 && rating % 1 !== 0) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

document.addEventListener("DOMContentLoaded", fetchVendors);

document.addEventListener("DOMContentLoaded", () => {
  page = "home";
  window.setupPageWebSocket(page);
});
