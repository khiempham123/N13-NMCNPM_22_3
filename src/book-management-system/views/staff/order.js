
// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  

  const ordersTableBody = document.querySelector("#ordersTable tbody");

  // Hàm fetch dữ liệu từ API
  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost:3000/staff/order");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const orders = await response.json();
      console.log(orders.orders)
      // Xóa nội dung cũ trước khi thêm dữ liệu mới
      ordersTableBody.innerHTML = "";

      // Duyệt qua danh sách đơn hàng và thêm vào bảng
      orders.orders.forEach((order, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", order._id);
        // Thêm các cột dữ liệu
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${order.userFullName}</td>
          <td>${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.city}</td>
          <td>$${order.totalAmount.toFixed(2)}</td>
          <td>${order.status}</td>
          <td>
            <button class="editOrder">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
        `;

        // Thêm hàng vào bảng
        ordersTableBody.appendChild(row);
        attachEditEvent();
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  // Gọi hàm fetchOrders khi tải trang
  document.getElementById("order").addEventListener("click", () => {
    fetchOrders(); // Chỉ gọi hàm fetchBooks khi nhấn vào trang Books
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
        const status = cells[4].textContent.trim().toLowerCase();

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
      const cells = currentRow.querySelectorAll("td");
  
      // Thu thập dữ liệu đã chỉnh sửa
      const orderId = currentRow.dataset.id; // Lấy ID đơn hàng từ thuộc tính data-id
      console.log(orderId)
      const updatedData = {
        userFullName: nameInput.value.trim(),
        address: {
          street: addressInput.value.trim().split(", ")[0], // Giả định format "street, ward, district, city"
          ward: addressInput.value.trim().split(", ")[1],
          district: addressInput.value.trim().split(", ")[2],
          city: addressInput.value.trim().split(", ")[3],
        },
        status: statusSelect.value,
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
          throw new Error("Failed to update order");
        }
  
        const updatedOrder = await response.json();
  
        // Cập nhật bảng với dữ liệu mới
        cells[1].textContent = updatedOrder.userFullName;
        cells[2].textContent = `${updatedOrder.address.street}, ${updatedOrder.address.ward}, ${updatedOrder.address.district}, ${updatedOrder.address.city}`;
        cells[4].textContent = updatedOrder.status;
  
        // Ẩn popup sau khi lưu thành công
        popup.style.display = "none";
      } catch (error) {
        console.error("Error updating order:", error);
        alert("Failed to update order. Please try again.");
      }
    }
  });

  // Optional: Close the popup when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
  }
});
