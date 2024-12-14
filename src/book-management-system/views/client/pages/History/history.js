const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  // Essential Variables
  const orderList = document.getElementById("order-list"); // Container for order rows
  const orderSummaryModal = document.getElementById("orderSummaryModal"); // Modal for order summary
  const closeModalBtn = document.querySelector(".modal .close"); // Close button for modal
  const searchInput = document.getElementById("search-input"); // Search input field
  const allOrdersTab = document.getElementById("all-orders-tab"); // "All Orders" tab
  const pendingOrdersTab = document.getElementById("pending-orders-tab"); // "Pending" tab
  const processingOrdersTab = document.getElementById("processing-orders-tab"); // "Processing" tab
  const completedOrdersTab = document.getElementById("completed-orders-tab"); // "Completed" tab
  const cancelledOrdersTab = document.getElementById("cancelled-orders-tab"); // "Cancelled" tab

  // Span Elements for Counts
  const allOrdersCount = document.getElementById("all-orders-count");
  const pendingOrdersCount = document.getElementById("pending-orders-count");
  const processingOrdersCount = document.getElementById(
    "processing-orders-count"
  );
  const completedOrdersCount = document.getElementById(
    "completed-orders-count"
  );
  const cancelledOrdersCount = document.getElementById(
    "cancelled-orders-count"
  );

  let ordersData = []; // Temporary storage for fetched orders

  // Function to Fetch Order Counts from Server
  const fetchOrderCounts = async () => {
    try {
      const url = `${API_BASE_URL}/order/order-counts`; // Endpoint for counts
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        console.error("No authorization token found.");
        // Optionally, redirect to login page or show a message
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"), // Correctly format the Authorization header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching order counts: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      // Update Count Elements
      allOrdersCount.textContent = data.total || 0;
      pendingOrdersCount.textContent = data.pending || 0;
      processingOrdersCount.textContent = data.processing || 0;
      completedOrdersCount.textContent = data.completed || 0;
      cancelledOrdersCount.textContent = data.cancelled || 0;
    } catch (error) {
      console.error("Error fetching order counts:", error);
      // Optionally, display an error message to the user here
    }
  };

  // Function to Fetch Orders from Server
  const fetchOrders = async (status = "all") => {
    try {
      let url = `${API_BASE_URL}/order`; // Base URL for fetching orders

      // Append status query parameter if provided and not 'all'
      if (status && status.toLowerCase() !== "all") {
        url += `?status=${status.toLowerCase()}`;
      }

      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        console.error("No authorization token found.");
        // Optionally, redirect to login page or show a message
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"), // Correctly format the Authorization header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }

      const data = await response.json();

      ordersData = data; // Store fetched orders (assuming the response has an 'orders' field)

      displayOrders(data); // Display orders in the table
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally, display an error message to the user here
      orderList.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Failed to load orders. Please try again later.</td></tr>`;
    }
  };

  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  }

  // Function to Display Orders in the Table
  const displayOrders = (orders) => {
    orderList.innerHTML = ""; // Clear existing orders

    if (orders.length === 0) {
      orderList.innerHTML = `<tr><td colspan="7" style="text-align: center;">No orders found.</td></tr>`;
      return;
    }

    orders.forEach((order) => {
      const statusClass = getStatusClass(order.status);
      const isPending = order.status.toLowerCase() === "pending";
      const orderRow = document.createElement("tr");

      orderRow.innerHTML = `
        <td><a href="#" class="view-order" data-order-id="${order._id}">#${
        order._id
      }</a></td>
        <td>${order.items.map((item) => item.title).join(", ")}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td class="${statusClass}">${capitalizeFirstLetter(order.status)}</td>
        <td>$${order.grandTotal.toFixed(2)}</td>
        <td><a href="#" class="invoice-icon" data-order-id="${
          order._id
        }"><i class="fas fa-file-invoice"></i></a></td>
        <td>
          ${
            isPending
              ? `<button class="delete-order-btn" data-order-id="${order._id}">Delete</button>`
              : ""
          }
        </td>
      `;

      orderList.appendChild(orderRow);
    });

    // Attach Event Listeners to Invoice Icons
    document.querySelectorAll(".invoice-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        const orderId = e.currentTarget.getAttribute("data-order-id");
        showOrderSummary(orderId);
      });
    });

    // Attach Event Listeners to Order Links
    document.querySelectorAll(".view-order").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const orderId = e.currentTarget.getAttribute("data-order-id");
        showOrderSummary(orderId);
      });
    });

    // Attach Event Listeners to Delete Buttons
    document.querySelectorAll(".delete-order-btn").forEach((button) => {
      button.addEventListener("click", handleDeleteOrder);
    });
  };

  // Function to Show Order Summary in Modal
  const showOrderSummary = (orderId) => {
    const order = ordersData.find((order) => order._id === orderId);
    if (!order) return;

    // Update Modal Content with Order Details
    document.getElementById(
      "product-cost"
    ).textContent = `$${order.totalAmount.toFixed(2)}`;
    document.getElementById("shipping-cost").textContent = `$${
      order.shippingFee ? order.shippingFee.toFixed(2) : "10.00"
    }`;
    document.getElementById(
      "subtotal-cost"
    ).textContent = `$${order.grandTotal.toFixed(2)}`;

    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear existing products

    // Populate Product List in Modal
    order.items.forEach((item) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      productDiv.innerHTML = `
        <img src="${
          item.bookId.thumbnail || "https://via.placeholder.com/60"
        }" alt="${item.title}">
        <div class="product-info">
          <h4>${item.title}</h4>
          <p>By: ${item.bookId.author || "Unknown"}</p>
        </div>
        <div class="product-price">
          <span>$${item.price.toFixed(2)}</span>
        </div>
      `;
      productList.appendChild(productDiv);
    });

    // Display the Modal
    orderSummaryModal.style.display = "block";
  };

  // Close Modal When 'X' is Clicked
  closeModalBtn.addEventListener("click", () => {
    orderSummaryModal.style.display = "none";
  });

  // Close Modal When Clicking Outside the Modal Content
  window.addEventListener("click", (event) => {
    if (event.target == orderSummaryModal) {
      orderSummaryModal.style.display = "none";
    }
  });

  // Search Functionality to Filter Orders
  searchInput.addEventListener("input", () => {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredOrders = ordersData.filter(
      (order) =>
        order._id.toLowerCase().includes(searchQuery) ||
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchQuery)
        )
    );
    displayOrders(filteredOrders);
  });

  // Handle Tab Clicks to Filter Orders by Status
  allOrdersTab.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(allOrdersTab);
    fetchOrders("all");
  });

  pendingOrdersTab.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(pendingOrdersTab);
    fetchOrders("pending");
  });

  processingOrdersTab.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(processingOrdersTab);
    fetchOrders("processing");
  });

  completedOrdersTab.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(completedOrdersTab);
    fetchOrders("completed");
  });

  cancelledOrdersTab.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(cancelledOrdersTab);
    fetchOrders("cancelled");
  });

  // Initial Fetch to Load All Orders and Counts
  fetchOrderCounts();
  fetchOrders();

  // Helper Function to Capitalize First Letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Helper Function to Set Active Tab
  function setActiveTab(activeTab) {
    // Remove 'active' class from all tabs
    [
      allOrdersTab,
      pendingOrdersTab,
      processingOrdersTab,
      completedOrdersTab,
      cancelledOrdersTab,
    ].forEach((tab) => {
      tab.classList.remove("active");
    });
    // Add 'active' class to the selected tab
    activeTab.classList.add("active");
  }

  // Hàm xử lý khi nhấn nút xóa
  const handleDeleteOrder = async (event) => {
    const orderId = event.target.getAttribute("data-order-id");
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: "DELETE",
        headers: {
          authorization: localStorage.getItem("token"), // Đảm bảo định dạng Authorization header
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        // Cập nhật lại danh sách đơn hàng và số lượng
        fetchOrderCounts();
        fetchOrders(getCurrentSelectedStatus());
      } else {
        alert(result.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Đã xảy ra lỗi khi xóa đơn hàng. Vui lòng thử lại sau.");
    }
  };

  // Helper Function to Get Currently Selected Status Tab
  const getCurrentSelectedStatus = () => {
    if (pendingOrdersTab.classList.contains("active")) return "pending";
    if (processingOrdersTab.classList.contains("active")) return "processing";
    if (completedOrdersTab.classList.contains("active")) return "completed";
    if (cancelledOrdersTab.classList.contains("active")) return "cancelled";
    return "all";
  };
});
