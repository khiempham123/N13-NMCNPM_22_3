

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  async function checkToken() {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      window.location.href = './login/login.html';
      return false;
    }

    try {
      const response = await fetch('http://localhost:3000/staff/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return true; // Token hợp lệ
      } else {
        alert('Token không hợp lệ, vui lòng đăng nhập lại!');
        window.location.href = './login/login.html';
        return false;
      }
    } catch (error) {
      console.error('Lỗi khi xác thực token:', error);
      alert('Đã xảy ra lỗi khi xác thực token!');
      window.location.href = 'login.html';
      return false;
    }
  }
  let ordersData = [];

  // Hàm fetch dữ liệu từ API
  async function fetchOrders(page = 1) {
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (!token) {
        alert('Bạn chưa đăng nhập!');
        window.location.href = './login/login.html';
        return;
      }
  
      const response = await fetch(
        `http://localhost:3000/staff/order?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
  
      const data = await response.json();
      ordersData = data.orders;
      const { orders, totalPages, currentPage } = data;
      console.log(data)
      // Hiển thị danh sách đơn hàng
      renderOrders(orders);
  
      // Hiển thị phân trang
      renderOrderPagination(totalPages, currentPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
  function renderOrders(orders) {
    const ordersTableBody = document.querySelector("#ordersTable tbody");
    ordersTableBody.innerHTML = ""; // Clear old content
  
    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", order._id);
  
      row.innerHTML = `
        <td>${order._id}</td>
        <td>${order.userFullName}</td>
        <td>${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.city}</td>
        <td>
          <button class="view-summary-btn" data-id="${order._id}">View Details</button>
        </td>
        <td>$${order.totalAmount.toFixed(2)}</td>
        <td>${order.status}</td>
        <td>
          <button class="editOrder">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </td>
      `;
  
      ordersTableBody.appendChild(row);
    });
  
    // Attach event listeners to "View Details" buttons
    document.querySelectorAll(".view-summary-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const orderId = e.target.getAttribute("data-id");
        showOrderSummary(orderId); // Gọi hàm hiển thị chi tiết đơn hàng
      });
    });
    // Gắn sự kiện cho nút "Edit"
    attachEditEvent();
  }
  
  function renderOrderPagination(totalPages, currentPage) {
    const paginationList = document.getElementById("orderpagination-list");
    paginationList.innerHTML = ""; // Xóa nội dung cũ
  
    // Nút "Previous"
    const prevButton = document.createElement("li");
    prevButton.innerHTML = `<a href="#topOrders"><i class="fa-solid fa-chevron-left"></i></a>`;
    if (currentPage === 1) prevButton.classList.add("disabled");
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        fetchOrders(currentPage - 1);
      }
    });
    paginationList.appendChild(prevButton);
  
    // Số trang
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("li");
      pageButton.innerHTML = `<a href="#topOrders">${i}</a>`;
      if (Number(currentPage) === Number(i)) {
        pageButton.classList.add("current");
      }
  
      pageButton.addEventListener("click", () => {
        if (currentPage !== i) {
          fetchOrders(i);
        }
      });
      paginationList.appendChild(pageButton);
    }
    // Nút "Next"
    const nextButton = document.createElement("li");
    nextButton.innerHTML = `<a href="#topOrders"><i class="fa-solid fa-chevron-right"></i></a>`;
    if (currentPage === totalPages) nextButton.classList.add("disabled");
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage = Number(currentPage) + 1;
        fetchOrders(currentPage);
      }
    });
    paginationList.appendChild(nextButton);
  }

  // Gọi hàm fetchOrders khi tải trang
  document.getElementById("order").addEventListener("click", () => {
    currentPage = 1; 
    fetchOrders(currentPage); // Chỉ gọi hàm fetchBooks khi nhấn vào trang Books
  });
  function showOrderSummary(orderId) {
    const order = ordersData.find((order) => order._id === orderId);
    if (!order) return;
  
    // Update modal content
    document.getElementById("product-cost").textContent = `$${order.totalAmount.toFixed(2)}`;
    document.getElementById("shipping-cost").textContent = `$${order.shippingFee?.toFixed(2) || "10.00"}`;
    document.getElementById("subtotal-cost").textContent = `$${order.grandTotal.toFixed(2)}`;
  
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear old content
  
    // Render product list
    order.items.forEach((item) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.innerHTML = `
            <img src="${item.thumbnail || "https://via.placeholder.com/60"}" alt="${item.title}" />
            <div class="product-info">
                <h4>${item.title}</h4>
                <p>By: ${item.bookId.author || "Unknown"}</p>
            </div>
            <div class="product-quantity">
                <span>x${item.quantity}</span>
            </div>
            <div class="product-price">
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `;
      productList.appendChild(productDiv);
    });
  
    // Display modal
    document.getElementById("order-summary-modal").style.display = "block";
  }
  
  // Close modal
  document.getElementById("close-order-summary").addEventListener("click", () => {
    document.getElementById("order-summary-modal").style.display = "none";
  });
  function attachEditEvent() {
  // Select all edit buttons within the table
  const editButtons = document.querySelectorAll(".editOrder");

  // Select the popup and its elements
  const popup = document.getElementById("editOrderPopup");
  const closeBtn = document.getElementById("closeEditOrderPopup");
  const saveBtn = document.getElementById("saveOrderBtn");
  const nameInput = document.getElementById("editOrderName");
  const addressInput = document.getElementById("editOrderAddress");
  const statusSelect = document.getElementById("order-status");

  // Variable to keep track of the current row being edited
  let currentRow = null;

  // Function to open the popup and populate it with current row data
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Find the closest table row (tr) from the clicked button
      currentRow = e.target.closest("tr");

      if (currentRow) {
        // Retrieve all cells (td) in the current row
        const cells = currentRow.querySelectorAll("td");

        // Extract data from the cells
        const name = cells[1].textContent.trim();
        const address = cells[2].textContent.trim();
        const status = cells[5].textContent.trim().toLowerCase();

        // Populate the popup input fields with the current data
        nameInput.value = name;
        addressInput.value = address;

        // Set the select dropdown to match the current status
        // This ensures that the correct option is selected regardless of case
        for (let option of statusSelect.options) {
          if (option.value.toLowerCase() === status) {
            statusSelect.value = option.value;
            break;
          }
        }

        // Display the popup by setting its display style to 'flex'
        popup.style.display = "flex";
      }
    });
  });

  // Function to close the popup without saving changes
  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Function to save the updated data back to the table
  saveBtn.addEventListener("click", async () => {
    if (currentRow) {
      console.log(currentRow)
      const cells = currentRow.querySelectorAll("td");
  
      // Thu thập dữ liệu đã chỉnh sửa
      const orderId = currentRow.dataset.id; // Lấy ID đơn hàng từ thuộc tính data-id
      const fullName = nameInput.value.trim();
      const addressText = addressInput.value.trim();
      const status = statusSelect.value;
  
      // Kiểm tra dữ liệu đầu vào
      if (!fullName || !addressText || !status) {
        alert("Please fill in all fields before saving.");
        return;
      }
  
      // Tách địa chỉ thành các phần
      const addressParts = addressText.split(", ");
      const updatedData = {
        userFullName: fullName,
        address: {
          street: addressParts[0] || "",
          ward: addressParts[1] || "",
          district: addressParts[2] || "",
          city: addressParts[3] || "",
        },
        status: status,
      };
  
      try {
        // Gửi yêu cầu cập nhật đến backend
        const response = await fetch(`http://localhost:3000/staff/order/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
  
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message || "Failed to update order");
        }
  
        const updatedOrder = await response.json();
  
        // Cập nhật bảng với dữ liệu mới
        cells[1].textContent = updatedOrder.userFullName;
        cells[2].textContent = `${updatedOrder.address.street}, ${updatedOrder.address.ward}, ${updatedOrder.address.district}, ${updatedOrder.address.city}`;
        cells[5].textContent = updatedOrder.status;
  
        // Ẩn popup sau khi lưu thành công
        popup.style.display = "none";
      } catch (error) {
        console.error("Error updating order:", error);
        alert(`Failed to update order: ${error.message}`);
      }
    }
  });
  const searchInput = document.getElementById("search-input-Orders"); 
  searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value;
    console.log(searchQuery)
    const filteredOrders = ordersData.filter(
      
      (order) =>
        order._id.toLowerCase().includes(searchQuery) ||
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchQuery)
        )
    );
    console.log(filteredOrders)
    renderOrders(filteredOrders);
  });
  // Đóng popup khi nhấp ra ngoài
  window.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
  }
});