// Lấy các phần tử
const filterBtn = document.querySelector(".btn-filter");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

// thanh kéo
const priceRange = document.getElementById("priceRange");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");

// Cập nhật giá trị hiển thị khi kéo thanh
priceRange.addEventListener("input", function () {
  minPrice.textContent = this.value;
});
const carouselImages = document.getElementById("carouselImages");
  const carouselButtons = document.getElementById("carouselButtons");
  const totalSlides = document.querySelectorAll(
    ".carousel-images img"
  ).length;

  let currentIndex = 0;

  // Tự động chuyển slide sau mỗi 3 giây
  const autoSlideInterval = 3000; // Thời gian chuyển (ms)
  let interval = setInterval(nextSlide, autoSlideInterval);

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides; // Chuyển sang slide tiếp theo
    updateCarousel();
  }

  function updateCarousel() {
    const offset = -currentIndex * 100; // Mỗi ảnh chiếm 100% chiều rộng container
    carouselImages.style.transform = `translateX(${offset}%)`;

    const buttons = document.querySelectorAll(".carousel-buttons button");
    buttons.forEach((button) => button.classList.remove("active"));
    buttons[currentIndex].classList.add("active");
  }

  // Tạo các nút điều hướng
  for (let i = 0; i < totalSlides; i++) {
    const button = document.createElement("button");
    button.textContent = i + 1;
    button.dataset.index = i;
    button.addEventListener("click", () => {
      clearInterval(interval); // Dừng tự động chuyển khi người dùng nhấn nút
      currentIndex = i;
      updateCarousel();
      interval = setInterval(nextSlide, autoSlideInterval); // Restart tự động chuyển
    });
    carouselButtons.appendChild(button);
  }

  // Khởi tạo slide đầu tiên
  updateCarousel();

  document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector(".user-icon");
    const profileCard = document.querySelector(".profile-card");
    const closeBtn = document.querySelector(".close-btn");

    // Hiển thị/hide khi click vào icon
    userIcon.addEventListener("click", (event) => {
        event.preventDefault();
        profileCard.style.display = profileCard.style.display === "none" || profileCard.style.display === "" ? "block" : "none";
    });

    // Đóng khi click vào nút đóng
    closeBtn.addEventListener("click", () => {
        profileCard.style.display = "none";
    });

    // Ẩn profile-card khi click ngoài khu vực
    document.addEventListener("click", (event) => {
        if (!profileCard.contains(event.target) && !userIcon.contains(event.target)) {
            profileCard.style.display = "none";
        }
    });
  });
























    console.log('JavaScript is running');
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page is fully loaded');
    const BASE_URL = 'http://localhost:3000/book';
    const LIMIT = 20; // Số sản phẩm trên mỗi trang
    let currentPage = 1; // Trang hiện tại
    let filters = {
        sort: 'default',
        minPrice: 0,
        maxPrice: 1000,
    };

    

    // Show Sidebar
    filterBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    // Hide Sidebar
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    closeFilter.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Update Price Filter
    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        priceDisplay.textContent = value;
        filters.minPrice = value;
        filters.maxPrice = 1000; // Hardcoded max
    });
    // Fetch products
    async function fetchProducts(page) {
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: LIMIT,
                sort: filters.sort,
                minPrice: filters.minPrice || '',
                maxPrice: filters.maxPrice || '',
            });
    
            console.log(`Fetching products for page ${page} with filters`, filters);
            console.log(`Fetching products from http://localhost:3000/book?${queryParams}`);
    
            const response = await fetch(`${BASE_URL}?${queryParams}`); // Fixed URL here
            const data = await response.json();
            console.log('Fetched products:', data);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            renderProducts(data.books);
            renderPagination(data.totalPages, page);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Render products
    function renderProducts(products) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear previous content

        products.forEach(product => {
            console.log('Rendering products:', products);
            const productHTML = `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div class="inner-box">
                        <div class="inner-image">
                            <img 
                                src="${product.thumbnail || 'assets/images/sp.jpg'}" 
                                alt="${product.title}" 
                                style="cursor: pointer;"
                            />
                            <div class="transaction trans-love">
                                <i class="fa-solid fa-heart"></i>
                            </div>
                            <div class="transaction trans-look">
                                <i class="fa-regular fa-eye"></i>
                            </div>
                            <div class="transaction trans-cart">
                                <i class="fa-solid fa-basket-shopping"></i>
                            </div>
                        </div>
                        <div class="inner-content">
                            <div class="inner-title">${product.title || "No title available"}</div>
                            <div class="inner-author">By ${product.authors || "Unknown Author"}</div>
                            <div class="inner-price-new">$${product.price ? product.price.toFixed(2) : "0.00"}</div>
                        </div>
                    </div>
                </div>`;
            productList.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    // Render pagination
    function renderPagination(totalPages, currentPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''; // Clear previous content

        for (let page = 1; page <= totalPages; page++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${page === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${page}</a>`;
            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                fetchProducts(page);
            });
            pagination.appendChild(pageItem);
        }
    }

    // Navigate to product detail
    window.navigateToDetail = function (productId) {
        if (!productId) {
            console.error('Product ID is missing.');
            return;
        }
        window.location.href = `../detail/detail.html?id=${productId}`;
    };

    // Sorting change
    document.getElementById('sorting').addEventListener('change', (e) => {
        filters.sort = e.target.value;
        fetchProducts(1);
    });

    // Initial fetch
    fetchProducts(currentPage);
});