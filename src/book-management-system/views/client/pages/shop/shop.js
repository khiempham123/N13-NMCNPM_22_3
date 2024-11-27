document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/api/products';
    const LIMIT = 8; // Số sản phẩm trên mỗi trang
    let currentPage = 1; // Trang hiện tại
    let filters = {
        sort: 'default',
        minPrice: 0,
        maxPrice: 1000,
    };

    // Sidebar elements
    const filterBtn = document.querySelector('.btn-filter');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeFilter = document.getElementById('close-filter');
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('price-display');

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

            const response = await fetch(`${BASE_URL}?${queryParams}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            renderProducts(data.products);
            renderPagination(data.totalPages, page);
        } catch (error) {
            console.error('Error fetching products:', error);
            document.getElementById('product-list').innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    }

    // Render products
    function renderProducts(products) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear previous content

        products.forEach(product => {
            const productHTML = `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <div class="inner-box">
                        <div class="inner-image">
                            <img 
                                src="${product.Thumbnail || 'assets/images/sp.jpg'}" 
                                alt="${product.Title}" 
                                onclick="navigateToDetail('${product._id}')"
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
                            <div class="inner-title">${product.Title || "No title available"}</div>
                            <div class="inner-author">By ${product.Authors || "Unknown Author"}</div>
                            <div class="inner-price-new">$${product.Price ? product.Price.toFixed(2) : "0.00"}</div>
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
document.addEventListener('DOMContentLoaded', async () => {
    const categoryFilter = document.getElementById('categoryFilter'); // Vùng hiển thị danh mục

    // Hàm lấy danh mục từ API
    async function fetchCategories() {
        try {
            const response = await fetch('/api/products/categories');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            // Hiển thị danh mục
            renderCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    // Hàm hiển thị danh mục vào sidebar
    function renderCategories(categories) {
        categoryFilter.innerHTML = ''; // Xóa nội dung cũ
        categories.forEach((category) => {
            const categoryHTML = `
                <li>
                    <input type="checkbox" value="${category}" class="category-checkbox" />
                    ${category}
                </li>`;
            categoryFilter.insertAdjacentHTML('beforeend', categoryHTML);
        });

        // Thêm sự kiện click cho các checkbox
        document.querySelectorAll('.category-checkbox').forEach((checkbox) => {
            checkbox.addEventListener('change', applyFilters);
        });
    }

    // Hàm áp dụng bộ lọc khi chọn danh mục
    function applyFilters() {
        const selectedCategories = Array.from(
            document.querySelectorAll('.category-checkbox:checked')
        ).map((checkbox) => checkbox.value);

        // Lọc sản phẩm theo danh mục đã chọn
        fetchProducts(1, { categories: selectedCategories });
    }

    // Hàm lấy sản phẩm (gọi API với các bộ lọc)
    async function fetchProducts(page, filters = {}) {
        const queryParams = new URLSearchParams({
            page,
            limit: 8, // Số sản phẩm mỗi trang
            category: filters.categories?.join(',') || '', // Danh mục
        });

        try {
            const response = await fetch(`/api/products?${queryParams}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            console.log('Filtered Products:', data.products); // Hiển thị sản phẩm (thay đổi giao diện tại đây)
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Gọi fetchCategories khi tải trang
    fetchCategories();
});