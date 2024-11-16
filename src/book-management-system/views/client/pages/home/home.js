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

