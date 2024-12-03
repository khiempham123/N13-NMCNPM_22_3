const API_BASE_URL = "http://localhost:3000";

async function fetchCart() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-cart`, {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Không thể tải giỏ hàng");
    }

    const cartData = await response.json();

    // Hiển thị sản phẩm trong giỏ hàng
    displayCartItems(cartData);
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra khi lấy giỏ hàng");
  }
}

// Hiển thị sản phẩm trong giỏ hàng
function displayCartItems(cart) {
  const cartItemsContainer = document.getElementById("cartItems");
  let totalPrice = 0; // Tổng giá trị giỏ hàng

  // Làm sạch container trước khi thêm các sản phẩm mới
  cartItemsContainer.innerHTML = "";

  cart.items.forEach((item) => {
    const itemTotalPrice = item.totalPrice;
    totalPrice += itemTotalPrice;

    // Tạo HTML cho mỗi sản phẩm trong giỏ hàng
    const cartItemHTML = `
        <div class="cart-item d-flex align-items-center mt-3" id="cart-item-${
          item._id
        }">
          <div class="d-flex align-items-center" style="width: 58%">
            <img src="${item.thumbnail}" alt="${
      item.title
    }" style="width: 50px; height: 50px; object-fit: cover;" />
            <div class="ms-3">
              <div><strong>${item.title}</strong></div>
              <div>${item.price} $</div>
            </div>
          </div>
          <div class="d-flex justify-content-between w-50">
            <div class="quantity-control d-flex align-items-center" style="gap: 10px;">
              <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity('${
                item._id
              }', -1)">-</button>
              <span id="quantity-${item._id}">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary ms-2" onclick="updateQuantity('${
                item._id
              }', 1)">+</button>
            </div>
            <div class="item-total-price" id="total-price-${
              item._id
            }">${itemTotalPrice.toFixed(2)} $</div>
            <button class="btn btn-sm btn-danger ms-3" onclick="removeItem('${
              item._id
            }')">Xóa</button>
          </div>
        </div>
      `;

    // Thêm HTML vào container
    cartItemsContainer.innerHTML += cartItemHTML;
  });

  // Cập nhật tổng giá trị giỏ hàng
  const totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.innerHTML = `${totalPrice.toFixed(2)} $`;

  const totalAmountSummary = document.getElementById("totalAmount");
  totalAmountSummary.innerHTML = `${cart.totalAmount.toFixed(2)} $`;

  const totalWithVAT = document.getElementById("totalWithVAT");
  totalWithVAT.innerHTML = `${(cart.totalAmount * 1.1).toFixed(2)} $`;

  const subTotal = document.getElementById("subTotal");
  subTotal.innerHTML = `${(cart.totalAmount * 1.1).toFixed(2)} $`;

  const totalCheckout = document.getElementById("total");
  totalCheckout.innerHTML = `${(cart.totalAmount * 1.1 + 10).toFixed(2)} $`;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(itemId, change) {
  const quantityElement = document.getElementById(`quantity-${itemId}`);
  const totalPriceElement = document.getElementById(`total-price-${itemId}`);

  let currentQuantity = parseInt(quantityElement.textContent);
  currentQuantity += change;

  if (currentQuantity == 0) {
    currentQuantity = 1; // Giới hạn số lượng tối thiểu là 1
    alert("Đã tối thiểu là 1!");
    return;
  }

  // Cập nhật số lượng trên UI
  quantityElement.textContent = currentQuantity;

  // Cập nhật lại tổng giá trị của item
  const itemPrice =
    parseFloat(totalPriceElement.textContent) /
    (parseInt(quantityElement.textContent) - change); // Tính giá từng sản phẩm
  const newTotalPrice = (itemPrice * currentQuantity).toFixed(2);
  totalPriceElement.textContent = newTotalPrice + " $";

  // Gửi yêu cầu API để cập nhật giỏ hàng trong cơ sở dữ liệu
  updateCartInDatabase(itemId, currentQuantity, newTotalPrice);
}

// Gửi yêu cầu tới backend để cập nhật giỏ hàng trong cơ sở dữ liệu
function updateCartInDatabase(itemId, quantity, totalPrice) {
  fetch(`${API_BASE_URL}/update/${itemId}`, {
    method: "PATCH",
    headers: {
      authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId,
      quantity,
      totalPrice,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Cập nhật tổng giỏ hàng sau khi thay đổi
      updateTotalCartAmount(data.cart.totalAmount);
    })
    .catch((error) => console.error("Error updating cart:", error));
}

// Cập nhật tổng giá trị giỏ hàng
function updateTotalCartAmount(totalAmount) {
  const totalAmountElement = document.getElementById("totalPrice");
  totalAmountElement.textContent = totalAmount.toFixed(2) + " $";

  const totalAmountSummary = document.getElementById("totalAmount");
  totalAmountSummary.textContent = totalAmount.toFixed(2) + " $";

  const totalWithVAT = document.getElementById("totalWithVAT");
  totalWithVAT.textContent = (totalAmount * 1.1).toFixed(2) + " $";

  const subTotal = document.getElementById("subTotal");
  subTotal.textContent = (totalAmount * 1.1).toFixed(2) + " $";

  const totalCheckout = document.getElementById("total");
  totalCheckout.textContent = (totalAmount * 1.1 + 10).toFixed(2) + " $";
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(itemId) {
  // Xóa item trong giỏ hàng (frontend)
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
  );

  // Nếu người dùng xác nhận, thực hiện xóa sản phẩm
  if (isConfirmed) {
    const itemElement = document.getElementById(`cart-item-${itemId}`);
    itemElement.remove();
    // Gửi yêu cầu API để xóa sản phẩm khỏi giỏ hàng trong cơ sở dữ liệu
    deleteItemFromDatabase(itemId);
  }
  return;
}

// Gửi yêu cầu tới backend để xóa sản phẩm khỏi giỏ hàng trong cơ sở dữ liệu
function deleteItemFromDatabase(itemId) {
  fetch(`${API_BASE_URL}/remove/${itemId}`, {
    method: "DELETE",
    headers: {
      authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Cập nhật lại tổng giỏ hàng sau khi xóa
      updateTotalCartAmount(data.cart.totalAmount);
    })
    .catch((error) => console.error("Error deleting item:", error));
}

// Tải giỏ hàng khi trang được load
window.onload = fetchCart;
