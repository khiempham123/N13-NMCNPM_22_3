const API_BASE_URL = "http://localhost:3000";

async function fetchFav() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-fav`, {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Không thể tải danh sách yêu thích");
    }

    const favData = await response.json();
    // Hiển thị sản phẩm trong danh sách yêu thích
    displayFavItems(favData);
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra khi lấy danh sách yêu thích");
  }
}

// Hàm hiển thị các sách yêu thích
function displayFavItems(favData) {
  const favList = document.getElementById("fav-list");
  favList.innerHTML = ""; // Clear any previous content

  if (favData && favData.items && favData.items.length > 0) {
    favData.items.forEach((item) => {
      const { title, price, rating, thumbnail } = item;
      const author = item.bookId.author;
      // Sử dụng hàm getStarRating để hiển thị sao thay vì số rating
      const starRating = getStarRating(rating);

      // Tạo phần tử cho mỗi sách yêu thích
      const bookItem = document.createElement("div");
      bookItem.classList.add("cart-item");
      bookItem.classList.add("d-flex");
      bookItem.classList.add("align-items-center");
      bookItem.style.marginTop = "20px";
      bookItem.id = `fav-item-${item._id}`; // Set ID for removal

      bookItem.innerHTML = `
          <div class="book-item d-flex align-items-center w-50">
              <img src="${thumbnail}" alt="${title}" />
              <div class="book-details">
                  <p class="book-title">${title}</p>
                  <p class="book-author">${author || "Unknown"}</p>
              </div>
          </div>
          <div class="w-50 d-flex justify-content-around align-items-center text-center">
              <div class="book-price">$${price.toFixed(2)}</div>
              <div class="book-rating">
                ${starRating}
              </div>
              <div>
                  <button class="btn btn-outline-danger btn-sm"
                  onclick="removeFromFav('${item._id}')" >
                      <i class="fas fa-trash" style="font-size: 20px;"></i>
                  </button>
              </div>
          </div>
        `;
      favList.appendChild(bookItem);
    });
  } else {
    favList.innerHTML = "<p>You have no favorite books.</p>";
  }
}

function getStarRating(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push('<i class="fa-solid fa-star" style="color: red;"></i>');
    } else {
      stars.push('<i class="fa-solid fa-star" style="color: #ccc;"></i>');
    }
  }
  return stars.join("");
}

// Xóa sản phẩm khỏi danh sách yêu thích
function removeFromFav(itemId) {
  // Xác nhận người dùng muốn xóa sản phẩm khỏi danh sách yêu thích
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích không?"
  );

  // Nếu người dùng xác nhận, thực hiện xóa sản phẩm
  if (isConfirmed) {
    console.log(itemId);
    const itemElement = document.getElementById(`fav-item-${itemId}`);
    console.log(itemElement);
    itemElement.remove();
    // Gửi yêu cầu API để xóa sản phẩm khỏi danh sách yêu thích trong cơ sở dữ liệu
    deleteItemFromFavDatabase(itemId);
  }
  return;
}

// Gửi yêu cầu tới backend để xóa sản phẩm khỏi danh sách yêu thích trong cơ sở dữ liệu
function deleteItemFromFavDatabase(itemId) {
  fetch(`${API_BASE_URL}/remove-fav/${itemId}`, {
    method: "DELETE",
    headers: {
      authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Cập nhật lại danh sách yêu thích sau khi xóa

      updateFavList(data.fav.items);
    })
    .catch((error) =>
      console.error("Error deleting item from favorites:", error)
    );
}

// Cập nhật lại danh sách yêu thích trên giao diện
function updateFavList(favItems) {
  // Giả sử bạn có một phần tử để hiển thị danh sách yêu thích
  const favContainer = document.getElementById("fav-container");
  favContainer.innerHTML = ""; // Xóa danh sách hiện tại

  // Lặp qua các sản phẩm yêu thích và thêm chúng vào lại
  favItems.forEach((item) => {
    const favItemElement = document.createElement("div");
    favItemElement.id = `fav-item-${item._id}`;
    favItemElement.classList.add("fav-item");

    favItemElement.innerHTML = `
        <div class="book-title">${item.title}</div>
        <div class="book-rating">${item.rating}</div>
        <div class="book-price">${item.price}</div>
        <button onclick="removeFromFav('${item._id}')">Remove</button>
      `;

    favContainer.appendChild(favItemElement);
  });
}

// Gọi hàm fetchFav để lấy dữ liệu khi trang được tải
document.addEventListener("DOMContentLoaded", fetchFav);
