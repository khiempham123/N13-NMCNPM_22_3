const API_BASE_URL = "http://localhost:3000";

async function fetchCart() {
  
  try {
    const response = await fetch(`${API_BASE_URL}/get-cart`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 404) {
      const message = await response.json();
      displayEmptyCart(); 
      return;
    }

    if (!response.ok) {
      throw new Error("Không thể tải giỏ hàng");
    }

    const cartData = await response.json();

    displayCartItems(cartData);
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra khi lấy giỏ hàng. Vui lòng thử lại.");
  }
}

function displayEmptyCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = '<p style="text-align: center; font-weight: bold; font-size: 1.25em; color : red">Your Cart is Empty.</p>';
  document.getElementById("totalPrice").textContent = "0 $";
  document.getElementById("totalAmount").textContent = "0 $";
  document.getElementById("totalWithVAT").textContent = "0 $";
  document.getElementById("subTotal").textContent = "0 $";
  document.getElementById("total").textContent = "0 $";
}

function displayCartItems(cart) {
  const cartItemsContainer = document.getElementById("cartItems");
  let totalPrice = 0; 

  cartItemsContainer.innerHTML = "";

  cart.items.forEach((item) => {
    const itemTotalPrice = item.totalPrice;
    totalPrice += itemTotalPrice;

    const cartItemHTML = `
        <div class="cart-item d-flex align-items-center mt-3" id="cart-item-${
          item._id
        }">
          <div class="d-flex align-items-center" style="width: 58%">
            <img src="${item.thumbnail}"  class="img-thumbnail" />
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

    cartItemsContainer.innerHTML += cartItemHTML;
  });

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

function updateQuantity(itemId, change) {
  const quantityElement = document.getElementById(`quantity-${itemId}`);
  const totalPriceElement = document.getElementById(`total-price-${itemId}`);

  let currentQuantity = parseInt(quantityElement.textContent);
  currentQuantity += change;

  if (currentQuantity == 0) {
    currentQuantity = 1; 
    alert("Đã tối thiểu là 1!");
    return;
  }

  quantityElement.textContent = currentQuantity;

  const itemPrice =
    parseFloat(totalPriceElement.textContent) /
    (parseInt(quantityElement.textContent) - change); 
  const newTotalPrice = (itemPrice * currentQuantity).toFixed(2);
  totalPriceElement.textContent = newTotalPrice + " $";

  updateCartInDatabase(itemId, currentQuantity, newTotalPrice);
}

function updateCartInDatabase(itemId, quantity, totalPrice) {
  fetch(`${API_BASE_URL}/update/${itemId}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
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
      updateTotalCartAmount(data.cart.totalAmount);
    })
    .catch((error) => console.error("Error updating cart:", error));
}

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

function removeItem(itemId) {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
  );

  if (isConfirmed) {
    const itemElement = document.getElementById(`cart-item-${itemId}`);
    itemElement.remove();
    deleteItemFromDatabase(itemId);
  }
  return;
}

function deleteItemFromDatabase(itemId) {
  fetch(`${API_BASE_URL}/remove/${itemId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId }),
  })
    .then((response) => response.json())
    .then((data) => {
      updateTotalCartAmount(data.cart.totalAmount);
    })
    .catch((error) => console.error("Error deleting item:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCart();
  window.initializeProfileModals();
});

document.querySelector(".btn-complete").addEventListener("click", async () => {
  try {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const address = document.getElementById("address").value.trim();
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");
    const wardSelect = document.getElementById("ward");

    const city = citySelect.options[citySelect.selectedIndex].text;
    const district = districtSelect.options[districtSelect.selectedIndex].text;
    const ward = wardSelect.options[wardSelect.selectedIndex].text;
    if (!firstName || !lastName || !address || !city || !district || !ward) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    const cartResponse = await fetch(`${API_BASE_URL}/get-cart`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!cartResponse.ok) {
      throw new Error("Không thể tải thông tin giỏ hàng");
    }

    const cartData = await cartResponse.json();

    const totalAmount = cartData.totalAmount;
    const shippingFee = 10; 
    const totalWithVAT = (totalAmount * 1.1 + shippingFee).toFixed(2);

    const orderData = {
      userFullName: `${firstName} ${lastName}`,
      address: {
        street: address,
        city,
        district,
        ward,
      },
      items: cartData.items,
      totalAmount,
      shippingFee,
      grandTotal: totalWithVAT,
    };

    const response = await fetch(`${API_BASE_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Không thể tạo đơn hàng");
    }

    const result = await response.json();

    alert("Đơn hàng của bạn đã được tạo thành công!");

    window.location.href = "../history/history.html";
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra khi hoàn tất đơn hàng. Vui lòng thử lại!");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  page = "cart";
  window.setupPageWebSocket(page)
});