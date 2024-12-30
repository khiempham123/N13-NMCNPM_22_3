const API_BASE_URL = "http://localhost:3000";

// DOM elements
const searchInput = document.querySelector(".form-control[type='search']");
const categoriesDropdown = document.getElementById("categories-dropdown"); // Dropdown danh mục
const resultsContainer = document.getElementById("results-container");
const loadingIndicator = document.getElementById("loading"); // Phần tử loading (nếu bạn thêm vào HTML)

// Hàm fetch danh sách sách theo danh mục và từ khóa
async function fetchAndDisplayFilteredBooks(category) {
  const query = searchInput.value.trim();

  // Tạo URL với query string
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (category) params.append("category", category);

  try {
    // Hiển thị loading
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
    }

    const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const books = await response.json();

    // Ẩn loading
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }

    // Hiển thị kết quả
    displaySearchResults(books);
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
    resultsContainer.innerHTML = `<p style="color: red;">Error fetching results. Please try again later.</p>`;
  }
}

// Hàm hiển thị kết quả
function displaySearchResults(books) {
  resultsContainer.innerHTML = ""; // Clear previous content

  if (books.length === 0) {
    resultsContainer.classList.add("empty"); // Thêm class 'empty' nếu không có kết quả
    resultsContainer.innerHTML = `<p>No books found matching your criteria.</p>`; // Nội dung thông báo
    hideSearchResults();
    return;
  } else {
    resultsContainer.classList.remove("empty"); // Loại bỏ class 'empty' nếu có kết quả
  }

  // Tạo một container cho các kết quả
  const resultsList = document.createElement("div");
  resultsList.classList.add("search-results-list");

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.className = "search-result-item";

    // Tạo liên kết đến trang chi tiết sản phẩm, giả sử trang chi tiết là 'detail.html?id=BOOK_ID'
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

  // Hiển thị kết quả tìm kiếm
  showSearchResults();
}

// Hàm fetch danh mục từ API và hiển thị trong dropdown
async function fetchCategories() {
  try {
    // Gọi API để lấy danh sách các danh mục
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const categories = await response.json();

    // Làm trống dropdown trước khi thêm danh mục mới
    categoriesDropdown.innerHTML = "";

    // Thêm mục "Tất cả" để không lọc theo danh mục
    const allItem = document.createElement("li");
    allItem.innerHTML = `
            <a class="dropdown-item" href="#" data-category="">
                All Category
            </a>
        `;
    categoriesDropdown.appendChild(allItem);

    // Render từng danh mục vào dropdown
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

// Lắng nghe sự kiện click vào dropdown để chọn danh mục
categoriesDropdown.addEventListener("click", (event) => {
  event.preventDefault();
  const categoryElement = event.target.closest("a"); // Xác định phần tử <a> trong dropdown
  if (categoryElement) {
    const category = categoryElement.getAttribute("data-category"); // Lấy giá trị category từ data-category
    // Cập nhật UI để đánh dấu danh mục đang chọn
    document
      .querySelectorAll("#categories-dropdown .dropdown-item")
      .forEach((item) => {
        item.classList.remove("active-category");
      });
    categoryElement.classList.add("active-category");
    fetchAndDisplayFilteredBooks(category); // Gọi API với danh mục đã chọn
  }
});

// Gọi API khi người dùng nhập tìm kiếm
searchInput.addEventListener("input", () => {
  const activeCategory = categoriesDropdown.querySelector(".active-category"); // Lấy danh mục đang được chọn
  const category = activeCategory
    ? activeCategory.getAttribute("data-category")
    : ""; // Nếu không có danh mục chọn, để trống
  fetchAndDisplayFilteredBooks(category); // Gọi API với category hiện tại
});

// Hàm ẩn kết quả tìm kiếm
function hideSearchResults() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.classList.remove("show"); // Loại bỏ lớp 'show' để ẩn kết quả
}

// Hàm hiển thị kết quả tìm kiếm
function showSearchResults() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.classList.add("show"); // Thêm lớp show để hiển thị kết quả với hiệu ứng
}

// Lắng nghe sự kiện click trên toàn bộ tài liệu
document.addEventListener("click", (event) => {
  const searchContainer = document.querySelector(".form-control");
  const resultsContainer = document.getElementById("results-container");

  // Nếu click không nằm trong search-container hoặc results-container, ẩn kết quả
  if (
    !searchContainer.contains(event.target) &&
    !resultsContainer.contains(event.target)
  ) {
    hideSearchResults();
  }
});

// end search

// Xử lý top category để điều hướng đến trang category
async function fetchTopCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/top-categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch top categories");
    }
    const categories = await response.json();
    
    // Render categories to the existing divs
    const container = document.querySelector(".container");
    if (!container) return; // Nếu không có container, không làm gì cả

    const divs = container.querySelectorAll(".topseller-item");

    categories.forEach((category, index) => {
      console.log(category)
      if (index < divs.length) {
        // Set the title for each category
        const link = divs[index];
        link.setAttribute("title", category._id);

        // Add a caption for the category
        const caption = link.querySelector(".product-caption");
        if (caption) {
          caption.innerHTML = `
                        <div class="caption-title"><span>${category._id}</span></div>
                        <div class="caption-total"><span>${category.count} products</span></div>
                    `;
        }

        // Lắng nghe sự kiện click để chuyển hướng
        link.addEventListener("click", () => {
          window.location.href = `../shop/shop.html?genre=${category._id}`;
        });
      }
    });
  } catch (error) {
    console.error("Error fetching top categories:", error);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCategories(); // Tải danh mục

  // Chọn mục "Tất cả" mặc định
  const allCategory = categoriesDropdown.querySelector(
    '.dropdown-item[data-category=""]'
  );
  if (allCategory) {
    allCategory.classList.add("active-category");
  }

  // fetchAndDisplayFilteredBooks(); // Hiển thị tất cả sách mặc định

  fetchTopCategories(); // Tải và hiển thị top categories
});

// 123456

// 123456

// start deals of the week

document.addEventListener("DOMContentLoaded", function () {
  const dealsContainer = document.getElementById("deals-of-the-week");
  const countdownDisplay = document.getElementById("countdown");

  // Hàm fetch dữ liệu từ API
  fetch(`${API_BASE_URL}/deals-of-the-week`)
    .then((response) => response.json())
    .then((data) => {
      // Nếu không có deals
      if (data.length === 0) {
        dealsContainer.innerHTML = "<p>No deals available this week.</p>";
        countdownDisplay.textContent = "00:00:00:00";
        return;
      }

      // Hiển thị countdown theo ngày kết thúc của deals
      const endDates = data.map((deal) => new Date(deal.endDate));
      const earliestEndDate = new Date(Math.min(...endDates));
      startCountdown(earliestEndDate, countdownDisplay);

      // Render danh sách deals
      for (let i = 0; i < data.length; i += 2) {
        const row = document.createElement("div");
        row.style.display = "flex"; // Tạo dòng chứa 2 deals
        row.style.justifyContent = "space-between";

        const dealPair = data.slice(i, i + 2); // Lấy 2 deals mỗi dòng
        dealPair.forEach((deal, index) => {
          // Tạo deal-item
          const dealItem = document.createElement("div");
          dealItem.classList.add("deal-item");
          dealItem.style.cursor = "pointer"; // Thay đổi con trỏ thành tay chỉ
          dealItem.setAttribute("data-id", deal._id); // Gắn ID của sách vào data-id

          // Thêm event click để chuyển hướng đến trang chi tiết
          dealItem.addEventListener("click", function () {
            window.location.href = `../detail/detail.html?id=${deal._id}`;
          });

          // Tạo phần ảnh sách
          const img = document.createElement("img");
          img.src = deal.thumbnail;
          img.alt = deal.dealDescription || `Book cover of ${deal.title}`;
          dealItem.appendChild(img);

          // Tạo thông tin deal
          const dealInfo = document.createElement("div");
          dealInfo.classList.add("deal-info");

          // Tên sách
          const title = document.createElement("h2");
          title.textContent = deal.title;
          dealInfo.appendChild(title);

          // Tác giả
          const author = document.createElement("p");
          author.textContent = deal.author;
          dealInfo.appendChild(author);

          // Giá cả
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

          // Số lượng đã bán
          const sold = document.createElement("p");
          sold.classList.add("sold");
          sold.textContent = `Already sold: ${deal.soldCount}/${deal.maxQuantity}`;
          dealInfo.appendChild(sold);

          // Thanh tiến độ
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

          // Gắn deal-info vào deal-item
          dealItem.appendChild(dealInfo);

          // Nếu là deal đầu tiên và có 2 deals, thêm divider dọc
          if (index === 0 && dealPair.length > 1) {
            const divider = document.createElement("div");
            divider.style.width = "1px";
            divider.style.backgroundColor = "#b3b3b3";
            divider.style.marginLeft = "20px";
            divider.style.marginRight = "20px";
            dealItem.appendChild(divider);
          }

          // Thêm deal-item vào row
          row.appendChild(dealItem);
        });

        // Thêm row vào container
        dealsContainer.appendChild(row);

        // Divider ngang giữa các dòng
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

    // Cập nhật ngay lập tức
    updateCountdown();

    // Cập nhật mỗi giây
    const interval = setInterval(updateCountdown, 1000);
  }
});
// end deals of the week

//Handle pre and next click on children type
document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.querySelector(".user-icon"); // Biểu tượng người dùng
  const loggedOutProfile = document.querySelector("#logged-out-profile"); // Modal khi chưa đăng nhập
  const loggedInProfile = document.querySelector("#logged-in-profile"); // Modal khi đã đăng nhập
  const closeBtns = document.querySelectorAll(".close-btn"); // Nút đóng của modal

  // Kiểm tra token từ localStorage
  const token = localStorage.getItem("token");
  // Ẩn modal khi mới tải trang
  loggedOutProfile.style.display = "none";
  loggedInProfile.style.display = "none";

  // Function to toggle the profile modal visibility
  const toggleProfileModal = () => {
    // Kiểm tra trạng thái đăng nhập dựa trên token
    if (token) {
      // Nếu có token (đã đăng nhập), hiển thị modal profile của người dùng
      loggedInProfile.style.display =
        loggedInProfile.style.display === "none" ||
        loggedInProfile.style.display === ""
          ? "flex"
          : "none";
      loggedOutProfile.style.display = "none"; // Ẩn modal đăng nhập/đăng ký
    } else {
      // Nếu không có token (chưa đăng nhập), hiển thị modal đăng nhập/đăng ký
      loggedOutProfile.style.display =
        loggedOutProfile.style.display === "none" ||
        loggedOutProfile.style.display === ""
          ? "flex"
          : "none";
      loggedInProfile.style.display = "none"; // Ẩn modal profile của người dùng
    }
  };

  // Hiển thị modal khi người dùng bấm vào icon
  userIcon.addEventListener("click", (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định
    toggleProfileModal(); // Gọi hàm toggle để hiển thị hoặc ẩn modal
  });

  // Đóng modal khi người dùng bấm vào nút đóng (x)
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      loggedOutProfile.style.display = "none";
      loggedInProfile.style.display = "none";
    });
  });

  // Đóng modal khi người dùng bấm ra ngoài modal
  document.addEventListener("click", (event) => {
    // Kiểm tra nếu người dùng bấm vào vùng ngoài modal
    if (
      !loggedOutProfile.contains(event.target) &&
      !loggedInProfile.contains(event.target) &&
      !userIcon.contains(event.target)
    ) {
      loggedOutProfile.style.display = "none"; // Ẩn modal đăng nhập/đăng ký
      loggedInProfile.style.display = "none"; // Ẩn modal profile của người dùng
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Phần sách ///////////////////////////////
// Hàm fetch và hiển thị sách lên giao diện
async function loadBestSellers() {
  try {
    // Fetch dữ liệu từ API
    const response = await fetch(`${API_BASE_URL}/best-seller`);
    const books = await response.json();

    // Tìm phần tử chứa sách (div section-three)
    const booksContainer = document.querySelector(
      ".section-three .container .row"
    );

    // Đảm bảo container trống trước khi hiển thị
    booksContainer.innerHTML = "";

    // Duyệt qua danh sách sách và tạo HTML cho từng sách
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

      // Thêm HTML vào container
      booksContainer.innerHTML += bookHTML;
    });
  } catch (error) {
    console.error("Error loading best sellers:", error);
  }
}
// Hàm giúp tạo các ngôi sao cho rating
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
// đến trang detail
function goToBookDetail(bookId) {
  window.location.href = `../detail/detail.html?id=${bookId}`;
}

// Chuyển hướng đến trang sách yêu thích
async function addToFav(event, bookId, title, thumbnail, price, rating) {
  // Ngừng sự kiện để không lan ra các phần tử cha
  event.stopPropagation();
  const token = localStorage.getItem("token");
  if(!token){
    alert("Thêm vào giỏ hàng thất bại. Đăng nhập và thử lại.");
    return;
  }
  try {
    // Gửi yêu cầu POST đến API để thêm sách vào danh sách yêu thích
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

    // Phản hồi từ server
    const result = await response.json();

    if (response.ok) {
      // Nếu thêm sách thành công
      alert("Sản phẩm đã được thêm vào danh sách yêu thích!");
    } else {
      // Nếu có lỗi từ phía server
      alert(result.message);
    }
  } catch (error) {
    // Xử lý lỗi khi không thể kết nối tới API
    console.error("Error adding to fav:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm vào danh sách yêu thích.");
  }
}

async function addToCart(event, bookId, title, thumbnail, price) {
  // Ngừng sự kiện để không lan ra các phần tử cha
  event.stopPropagation();
  const token = localStorage.getItem("token");
  if(!token){
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
        quantity: 1, // Mặc định là 1, có thể điều chỉnh sau
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

// vendor
async function fetchVendors() {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor`);
    const vendors = await response.json();

    // Xử lý dữ liệu và render HTML cho các vendors
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

      // Gắn sự kiện khi nhấn vào vendor sẽ chuyển hướng đến trang chi tiết
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

// Hàm render các ngôi sao đánh giá
function renderStars(rating) {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      // Hiển thị sao đầy
      stars += '<i class="fas fa-star"></i>';
    } else if (i < Math.floor(rating) + 0.5 && rating % 1 !== 0) {
      // Hiển thị sao một nửa
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      // Hiển thị sao rỗng
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

// Fetch dữ liệu khi trang được load
document.addEventListener("DOMContentLoaded", fetchVendors);


document.addEventListener("DOMContentLoaded", () => {
  page = "home";
  window.setupPageWebSocket(page)
});