const API_BASE_URL = "http://localhost:3000";

async function fetchVendorsForSidebar() {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor`);
    const vendors = await response.json();

    const vendorListContainer = document.getElementById("sidebar-vendor-list");
    vendorListContainer.innerHTML = ""; // Clear list hiện tại trước khi thêm mới

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
                </div>
            `;
      vendorItem.addEventListener("click", () => {
        // window.location.href = `../Vendor/vendor.html?vendorName=${encodeURIComponent(
        //   vendor.vendor
        // )}`;
        event.preventDefault();

        const newUrl = `./vendor.html?vendorName=${encodeURIComponent(
          vendor.vendor
        )}`;
        history.pushState(null, "", newUrl);
        fetchVendorInfo();
      });
      vendorListContainer.appendChild(vendorItem);
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }
}

// banner verndor

async function fetchVendorInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const vendorName = decodeURIComponent(urlParams.get("vendorName"));
  try {
    // Gọi API lấy thông tin vendor theo vendorName
    const response = await fetch(`${API_BASE_URL}/vendor/${vendorName}`);
    if (!response.ok) {
      throw new Error("Vendor not found");
    }
    const vendor = await response.json();

    // Cập nhật thông tin lên HTML
    document.getElementById("vendor-logo").src = vendor.thumbnail;
    document.getElementById("vendor-name").innerText = vendor.vendor;
    document.getElementById("vendor-address").innerText = vendor.address;
    document.getElementById("vendor-phone").innerText = vendor.phoneNumber;
    document.getElementById("vendor-rating").innerHTML = renderStars(
      vendor.rating
    );

    // Cập nhật background image nếu cần thiết
    // document.querySelector(".background-image").src =
    //   vendor.backgroundImage || document.querySelector(".background-image").src;
    fetchBookOfVendor(vendorName);
  } catch (error) {
    console.error("Error fetching vendor info:", error);
    alert("Error fetching vendor information");
  }
}

// sách của vendor
async function fetchBookOfVendor(vendorName) {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/${vendorName}`);
    const books = await response.json();

    const booksContainer = document.querySelector(
      ".section-three .container .row .col-xl-9.col-lg-9.col-md-9 .row"
    );

    booksContainer.innerHTML = "";

    books.books.forEach((book) => {
      const bookHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
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
    console.error("Error loading book of vendor:", error);
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
// đến trang detail
function goToBookDetail(bookId) {
  window.location.href = `../detail/detail.html?id=${bookId}`;
}

// Chuyển hướng đến trang sách yêu thích
async function addToFav(event, bookId, title, thumbnail, price, rating) {
  // Ngừng sự kiện để không lan ra các phần tử cha
  event.stopPropagation();

  try {
    // Gửi yêu cầu POST đến API để thêm sách vào danh sách yêu thích
    const response = await fetch(`${API_BASE_URL}/add-to-fav`, {
      method: "POST",
      headers: {
        authorization: localStorage.getItem("token"),
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
      console.error(result.message);
      alert("Sách đã tồn tại trong danh sách yêu thích của bạn!");
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

  try {
    const response = await fetch(`${API_BASE_URL}/add-to-cart`, {
      method: "POST",
      headers: {
        authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
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
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
  }
}

// Gọi hàm fetchVendorsForSidebar khi trang được tải
document.addEventListener("DOMContentLoaded", fetchVendorsForSidebar);

document.addEventListener("DOMContentLoaded", fetchVendorInfo);
