const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  window.initializeProfileModals();
  const url = new URL(window.location.href);
  const bookId = url.searchParams.get("id");

  fetch(`${API_BASE_URL}/detail/${bookId}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data || data.deleted) {
        console.error("Book not found or deleted.");
        return;
      }
      // Cập nhật thông tin sách
      document.getElementById("book-image").src =
        data.thumbnail || "default-thumbnail.jpg";
      document.getElementById("book-title").innerText =
        data.title || "Unknown Title";
      document.getElementById("book-author").innerText = `Author: ${
        data.author || "Unknown"
      }`;
      document.getElementById("book-publisher").innerText = `Publisher: ${
        data.publisher || "Unknown"
      }`;
      document.getElementById("book-categories").innerText = `Category: ${
        data.category || "Unknown"
      }`;

      document.getElementById("book-publishDate").innerText = `Publish Date: ${
        data.publishDate || "Unknown Date"
      }`;

      document.getElementById("book-rating").innerHTML = renderStars(
        data.rating
      );

      document.getElementById("current-price").innerText = `$${
        ((data.price * (100 - data.percentDiscount)) / 100).toFixed(2) || 0.0
      }`;
      document.getElementById("old-price").innerText = `$${data.price || 0.0}`;
      document.getElementById("discount").innerText = `-${
        data.percentDiscount || 0.0
      } %`;
      document.getElementById("book-desc").innerText =
        data.description || "No description available.";
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
    });
});

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
    if (relatedProducts.length === 1) {
      productList.style.justifyContent = "flex-start"; // Giữ sản phẩm canh trái
    } else {
      productList.style.justifyContent = "normal"; // Bình thường với nhiều sản phẩm
    }
    // Duyệt qua danh sách sản phẩm và render HTML cho từng sản phẩm
    relatedProducts.forEach((product) => {
      const finalPrice = product.price
        ? (
            product.price -
            (product.price * (product.percentDiscount || 0)) / 100
          ).toFixed(2)
        : "N/A";
        const productHTML = `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="inner-box" onclick="goToBookDetail('${product._id}')">
            <div class="inner-image">
              <img src="${product.thumbnail || 'default-thumbnail.jpg'}" alt="${product.title || 'No title'}">
              <div class="transaction trans-love" onclick="addToFav(event, '${product._id}', '${product.title}', '${product.thumbnail}', ${product.price || 0}, ${product.rating || 0})">
                <i class="fa-solid fa-heart" style="color: #ee2b3e;"></i>  
              </div>
              <div class="transaction trans-cart" onclick="addToCart(event, '${product._id}', '${product.title}', '${product.thumbnail}', ${product.price || 0})">
                <i class="fa-solid fa-basket-shopping"></i>
              </div>
            </div>
            <div class="inner-content">
              <div class="inner-title">${product.title || "No title"}</div>
              <div class="inner-author">${product.author || "Unknown author"}</div>
              <div class="rate" style="color: #ee2b3e;">
                ${getStarRating(product.rating || 0)}
              </div>
              <div class="inner-price-new">
                ${finalPrice}
                <div class="inner-price-old">${product.price ? `$${product.price}` : ""}</div>
              </div>
              <div class="inner-discount">${product.percentDiscount ? `-${product.percentDiscount}%` : ""}</div>
            </div>
          </div>
        </div>
      `;
      productList.innerHTML += productHTML;
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

  try {
    // Gửi yêu cầu POST đến API để thêm sách vào danh sách yêu thích
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



document.addEventListener("DOMContentLoaded", () => {
  // Lấy các thành phần cần thiết
  const quantityElement = document.getElementById("quantity");
  const decreaseButton = document.getElementById("decrease");
  const increaseButton = document.getElementById("increase");
  const addToCartButton = document.querySelector(".add-to-cart");

  let quantity = parseInt(quantityElement.innerText, 10) || 1;

  // Xử lý sự kiện tăng số lượng
  increaseButton.addEventListener("click", () => {
    quantity++;
    quantityElement.innerText = quantity;
  });

  // Xử lý sự kiện giảm số lượng
  decreaseButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityElement.innerText = quantity;
    } else {
      alert("Số lượng phải lớn hơn 0!");
    }
  });

  // Xử lý sự kiện thêm sản phẩm vào giỏ hàng
  addToCartButton.addEventListener("click", async () => {
    const bookId = new URL(window.location.href).searchParams.get("id");
    const token = localStorage.getItem("token");
  
    if (!bookId) {
      alert("Không tìm thấy sản phẩm để thêm vào giỏ hàng.");
      return;
    }
  
    if (!token) {
      alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng.");
      return;
    }
  
    // Lấy thông tin sách từ DOM hoặc từ dữ liệu đã fetch
    const title = document.getElementById("book-title").innerText;
    const thumbnail = document.getElementById("book-image").src;
    const price = parseFloat(
      document.getElementById("current-price").innerText.replace("$", "")
    );
    const quantity = parseInt(document.getElementById("quantity").innerText, 10) || 1;
  
    // Kiểm tra dữ liệu cần thiết trước khi gửi
    if (!title || !thumbnail || isNaN(price)) {
      alert("Không thể lấy đầy đủ thông tin sách. Vui lòng thử lại.");
      return;
    }
  
    const payload = {
      bookId: bookId,
      title: title,
      thumbnail: thumbnail,
      price: price,
      quantity: quantity,
    };
  
  
    try {
      const response = await fetch(`${API_BASE_URL}/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token xác thực
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        alert(result.message || "Có lỗi xảy ra khi thêm vào giỏ hàng.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
    }
  });
  
});




document.querySelector(".wishlist").addEventListener("click", async () => {
  const bookId = new URL(window.location.href).searchParams.get("id");
  const token = localStorage.getItem("token");

  if (!bookId) {
    alert("Không tìm thấy sản phẩm để thêm vào danh sách yêu thích.");
    return;
  }

  if (!token) {
    alert("Vui lòng đăng nhập trước khi thêm vào danh sách yêu thích.");
    return;
  }

  // Lấy thông tin sách từ DOM hoặc từ dữ liệu đã fetch
  const title = document.getElementById("book-title").innerText;
  const thumbnail = document.getElementById("book-image").src;
  const price = parseFloat(
    document.getElementById("current-price").innerText.replace("$", "")
  );
  const rating = parseFloat(
    document.getElementById("book-rating").getAttribute("data-rating") 
  );

  // Kiểm tra dữ liệu cần thiết
  if (!title || !thumbnail || isNaN(price) || isNaN(rating)) {
    alert("Không thể lấy đầy đủ thông tin sách. Vui lòng thử lại.");
    return;
  }

  const payload = {
    bookId: bookId,
    title: title,
    thumbnail: thumbnail,
    price: price,
    rating: rating,
  };


  try {
    const response = await fetch(`${API_BASE_URL}/add-to-fav`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token xác thực
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Sách đã được thêm vào danh sách yêu thích!");
    } else {
      alert(result.message || "Có lỗi xảy ra khi thêm vào danh sách yêu thích.");
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    alert("Không thể thêm sách vào danh sách yêu thích. Vui lòng thử lại.");
  }
});


document.addEventListener("DOMContentLoaded", () => {

  page = "detail";
  window.setupPageWebSocket(page)
});