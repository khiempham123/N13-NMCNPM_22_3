const API_BASE_URL = "http://localhost:3000";
const categoriesDropdown = document.getElementById("categories-dropdown");

// Hàm fetch categories từ API và hiển thị trong dropdown
async function fetchAndDisplayCategoriesInDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();

        // Xóa nội dung hiện tại
        categoriesDropdown.innerHTML = "";

        // Render từng category vào dropdown
        categories.forEach(category => {
            const categoryItem = document.createElement("li");
            categoryItem.innerHTML = `
                <a class="dropdown-item d-flex align-items-center" href="../category/category.html?category=${category.name}">
                    <i class="fa-regular fa-circle-user me-2" style="width: 25px;"></i>
                    <span>${category.name}</span>
                </a>
            `;
            categoriesDropdown.appendChild(categoryItem);
        
            if (category !== categories[categories.length - 1]) {
                const divider = document.createElement("li");
                divider.innerHTML = '<hr class="dropdown-divider">';
                categoriesDropdown.appendChild(divider);
            }
        });
        
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Gọi hàm fetch khi trang đã sẵn sàng
document.addEventListener("DOMContentLoaded", fetchAndDisplayCategoriesInDropdown);



// Chức năng Search
const searchInput = document.querySelector(".form-control[type='search']");
const searchButton = document.querySelector(".input-group-text");
const searchResultsContainer = document.createElement("ul");

// Append the search results container
searchInput.parentElement.appendChild(searchResultsContainer);

// Set up initial styles for the dropdown container
searchResultsContainer.style.position = "absolute";
searchResultsContainer.style.background = "#fff";
searchResultsContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
searchResultsContainer.style.border = "1px solid #ddd";
searchResultsContainer.style.borderRadius = "0 0 5px 5px";
searchResultsContainer.style.listStyle = "none";
searchResultsContainer.style.padding = "0";
searchResultsContainer.style.margin = "0";
searchResultsContainer.style.zIndex = "1000";
searchResultsContainer.style.display = "none"; // Hidden by default

/**
 * Update the dropdown position to align with the search input.
 */
function updateDropdownPosition() {
    const rect = searchInput.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    searchResultsContainer.style.top = `${rect.bottom + scrollY}px`;
    searchResultsContainer.style.left = `${rect.left + scrollX}px`;
    searchResultsContainer.style.width = `${rect.width}px`;
    searchResultsContainer.style.position = "absolute";
}

/**
 * Fetch books and display results in dropdown.
 */
async function fetchAndDisplaySearchResults() {
    const query = searchInput.value.trim();

    if (query.length === 0) {
        searchResultsContainer.innerHTML = "";
        searchResultsContainer.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${query}`);
        const books = await response.json();
        searchResultsContainer.innerHTML = "";

        if (books.length === 0) {
            searchResultsContainer.innerHTML = "<li style='padding: 10px;'>No results found</li>";
            searchResultsContainer.style.display = "block";
            updateDropdownPosition();
            return;
        }

        books.forEach((book) => {
            const bookItem = document.createElement("li");
            bookItem.style.padding = "10px";
            bookItem.style.cursor = "pointer";
            bookItem.style.borderBottom = "1px solid #ddd";
            bookItem.innerHTML = `
                <a href="../book/detail.html?id=${book._id}" style="text-decoration: none; color: black;">
                    <strong>${book.Title}</strong> - <em>${book.Authors && book.Authors.trim() ? book.Authors : "Unknown Author"}</em>

                </a>
            `;
            searchResultsContainer.appendChild(bookItem);
        });

        // Điều chỉnh max-height nếu số lượng kết quả > 5
        if (books.length > 5) {
            searchResultsContainer.style.maxHeight = "300px"; // Giới hạn chiều cao
            searchResultsContainer.style.overflowY = "auto"; // Bật thanh cuộn dọc
        } else {
            searchResultsContainer.style.maxHeight = ""; // Không giới hạn chiều cao
            searchResultsContainer.style.overflowY = "hidden"; // Ẩn thanh cuộn
        }

        searchResultsContainer.style.display = "block";
        updateDropdownPosition();
    } catch (error) {
        console.error("Error searching books:", error);
        searchResultsContainer.innerHTML = `
            <li style="color: red; padding: 10px;">Error fetching results. Please try again later.</li>
        `;
        searchResultsContainer.style.display = "block";
    }
}

// Event listener for search input to trigger search
searchInput.addEventListener("input", fetchAndDisplaySearchResults);

// Event listener for the search button to trigger search
searchButton.addEventListener("click", fetchAndDisplaySearchResults);

// Event listener to hide dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
        searchResultsContainer.innerHTML = "";
        searchResultsContainer.style.display = "none";
    }
});

// Event listeners to update dropdown position on resize or scroll
window.addEventListener("resize", updateDropdownPosition);
window.addEventListener("scroll", updateDropdownPosition);


//countdown
// Hàm thiết lập đếm ngược
function startCountdown(durationInSeconds) {
    const countdownElement = document.getElementById('countdown');
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

//end



/// click nav

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



// top seller
async function fetchTopCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/top-categories`);
        if (!response.ok) {
            throw new Error("Failed to fetch top categories");
        }
        const categories = await response.json();

        // Render categories to the existing divs
        const container = document.querySelector('.container');
        const divs = container.querySelectorAll('.topseller-item');

        categories.forEach((category, index) => {
            if (index < divs.length) {
                // Set the title for each category
                const link = divs[index];
                link.setAttribute('title', category._id);

                // Add a caption for the category
                const caption = link.querySelector('.product-caption');
                caption.innerHTML = `
                    <div class="caption-title"><span>${category._id}</span></div>
                    <div class="caption-total"><span>${category.count} products</span></div>
                `;
            }
        });
    } catch (error) {
        console.error("Error fetching top categories:", error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchTopCategories);
// end top seller