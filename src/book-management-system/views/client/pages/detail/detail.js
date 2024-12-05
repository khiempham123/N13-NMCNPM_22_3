const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
const url = new URL(window.location.href);
const bookId = url.searchParams.get("id");

fetch(`${API_BASE_URL}/detail/${bookId}`)
.then((response) => response.json())
.then((data) => {
if (!data || data.deleted) {
console.error("Book not found or deleted.");
return;
}
console.log(`Fetching from: ${API_BASE_URL}/detail/${bookId}`);

// Cập nhật thông tin sách
document.getElementById("book-image").src =
data.thumbnail || "default-thumbnail.jpg";
document.getElementById("book-title").innerText =
data.title || "Unknown Title";
document.getElementById("book-author").innerText = `Author: ${
data.author || "Unknown"
}`;
document.getElementById("book-rating").innerText = data.bestSeller
? "4.6"
: "4.0";
document.getElementById("book-price").innerText = `$${data.price || 0.0}`;
document.getElementById("book-desc").innerText =
data.description || "No description available.";

// Cập nhật danh mục
const categoriesElement = document.getElementById("book-categories");
categoriesElement.innerHTML = `<span>Categories:</span> <a href="#">${
  data.category || "Unknown"
  }</a>`;

const tagsElement = document.getElementById("book-tags");
tagsElement.innerHTML = `<span>Tags:</span> <a href="#">Books</a>, <a href="#">Fiction</a>`;
})
.catch((error) => {
console.error("Error fetching book details:", error);
});
});

// Start lấy thông tin các sản phẩm có cùng category với sản phẩm detail từ api /related/:id

// Hàm fetch dữ liệu liên quan và hiển thị lên giao diện
async function fetchAndRenderRelatedProducts(bookId) {
try {
// Gọi API để lấy danh sách sản phẩm liên quan
const response = await fetch(`${API_BASE_URL}/detail/related/${bookId}`);
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}

const relatedProducts = await response.json(); // Parse JSON từ response

// Tìm container để render sản phẩm
const productList = document.getElementById("product-list");

productList.innerHTML = ""; // Xóa các sản phẩm cũ (nếu có)

// Duyệt qua danh sách sản phẩm và render HTML cho từng sản phẩm
relatedProducts.forEach((product) => {
const productHTML = `
<div class="col-xl-2 col-lg-2 col-md-4">
  <div class="inner-box">
    <div class="inner-image">
      <img src="${
                              product.thumbnail ||
                              " https://via.placeholder.com/150" }" alt="${product.title}" />
      <div class="transaction trans-love">
        <i class="fa-solid fa-heart"></i>
      </div>
      <div class="transaction trans-cart">
        <i class="fa-solid fa-basket-shopping"></i>
      </div>
    </div>
    <div class="inner-content">
      <div class="inner-title">${product.title}</div>
      <div class="inner-author">${product.author}</div>
      <div class="inner-price-new">${product.price}</div>
    </div>
  </div>
</div>
`;
productList.innerHTML += productHTML; // Thêm sản phẩm vào danh sách
});
} catch (error) {
console.error("Error fetching related products:", error);
}
}

// Gọi hàm fetch khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
const url = new URL(window.location.href);
const currentProductId = url.searchParams.get("id");
fetchAndRenderRelatedProducts(currentProductId);
});

// End lấy thông tin các sản phẩm có cùng category với sản phẩm detail từ api /related/:id

//backhome
const gohome = document.getElementById("goHome");
gohome.addEventListener("click", () => {
window.location.href = "../home/home.html";
});