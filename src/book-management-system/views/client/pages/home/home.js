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
            loadingIndicator.style.display = 'block';
        }

        const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }
        const books = await response.json();

        // Ẩn loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        // Hiển thị kết quả
        displaySearchResults(books);
    } catch (error) {
        console.error("Error fetching filtered books:", error);
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        resultsContainer.innerHTML = `<p style="color: red;">Error fetching results. Please try again later.</p>`;
    }
}

// Hàm hiển thị kết quả
function displaySearchResults(books) {
    resultsContainer.innerHTML = ""; // Clear previous content

    if (books.length === 0) {
        resultsContainer.classList.add('empty'); // Thêm class 'empty' nếu không có kết quả
        resultsContainer.innerHTML = `<p>No books found matching your criteria.</p>`; // Nội dung thông báo
        hideSearchResults();
        return;
    } else {
        resultsContainer.classList.remove('empty'); // Loại bỏ class 'empty' nếu có kết quả
    }

    // Tạo một container cho các kết quả
    const resultsList = document.createElement("div");
    resultsList.classList.add("search-results-list");

    books.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.className = "search-result-item";
        bookItem.innerHTML = `
            <img src="${book.Thumbnail}" alt="${book.Title}" class="book-image">
            <div class="book-info">
                <h4>${book.Title}</h4>
                <p><strong>Author:</strong> ${book.Author || "Unknown"}</p>
                <p class="book-price"><i class="fa-solid fa-dollar-sign"></i>${book.Price.toFixed(2)}</p>
            </div>
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
        document.querySelectorAll("#categories-dropdown .dropdown-item").forEach(item => {
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
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('show'); // Loại bỏ lớp 'show' để ẩn kết quả
}

// Hàm hiển thị kết quả tìm kiếm
function showSearchResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.add('show'); // Thêm lớp show để hiển thị kết quả với hiệu ứng
}

// Lắng nghe sự kiện click trên toàn bộ tài liệu
document.addEventListener('click', (event) => {
    const searchContainer = document.querySelector('.form-control');
    const resultsContainer = document.getElementById('results-container');

    // Nếu click không nằm trong search-container hoặc results-container, ẩn kết quả
    if (!searchContainer.contains(event.target) && !resultsContainer.contains(event.target)) {
        hideSearchResults();
    }
});


// end search

// Hàm thiết lập đếm ngược (countdown)
function startCountdown(durationInSeconds) {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return; // Nếu không có phần tử countdown, không làm gì cả

    let remainingTime = durationInSeconds;

    function updateTimer() {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        // Hiển thị dạng HH:MM:SS
        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Giảm thời gian còn lại và dừng khi hết giờ
        if (remainingTime > 0) {
            remainingTime--;
        } else {
            clearInterval(timerInterval);
            countdownElement.textContent = "00:00:00"; // Hết giờ
        }
    }

    // Gọi hàm cập nhật mỗi giây
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

// Bắt đầu đếm ngược với 24 giờ (24 * 60 * 60 giây)
startCountdown(24 * 60 * 60);

// Lắng nghe sự kiện click trên các liên kết navbar
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", async (event) => {
        event.preventDefault();
        const target = event.target.textContent.trim();

        switch (target) {
            case "Home":
                window.location.href = "./home.html";
                break;
            case "Book":
                window.location.href = "../shop/shop.html";
                break;
            case "Author":
                window.location.href = "/authors.html";
                break;
            case "Blog":
                window.location.href = "/blog.html";
                break;
            case "Contact":
                window.location.href = "/contact.html";
                break;
            default:
                console.error("Unhandled link:", target);
        }
    });
});

// Xử lý top category để điều hướng đến trang category
async function fetchTopCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/top-categories`);
        if (!response.ok) {
            throw new Error("Failed to fetch top categories");
        }
        const categories = await response.json();

        // Render categories to the existing divs
        const container = document.querySelector('.container');
        if (!container) return; // Nếu không có container, không làm gì cả

        const divs = container.querySelectorAll('.topseller-item');

        categories.forEach((category, index) => {
            if (index < divs.length) {
                // Set the title for each category
                const link = divs[index];
                link.setAttribute('title', category._id);

                // Add a caption for the category
                const caption = link.querySelector('.product-caption');
                if (caption) {
                    caption.innerHTML = `
                        <div class="caption-title"><span>${category._id}</span></div>
                        <div class="caption-total"><span>${category.count} products</span></div>
                    `;
                }

                // Lắng nghe sự kiện click để chuyển hướng
                link.addEventListener("click", () => {
                    window.location.href = `../category/category.html?category=${category._id}`;
                });
            }
        });
    } catch (error) {
        console.error("Error fetching top categories:", error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories(); // Tải danh mục

    // Chọn mục "Tất cả" mặc định
    const allCategory = categoriesDropdown.querySelector('.dropdown-item[data-category=""]');
    if (allCategory) {
        allCategory.classList.add('active-category');
    }

    // fetchAndDisplayFilteredBooks(); // Hiển thị tất cả sách mặc định

    fetchTopCategories(); // Tải và hiển thị top categories
});




// 123456