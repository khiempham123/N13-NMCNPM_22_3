const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  const orderList = document.getElementById("order-list");
  const orderSummaryModal = document.getElementById("orderSummaryModal");
  const closeModalBtn = document.querySelector(".modal .close");
  const searchInput = document.getElementById("search-input");
  const allOrdersTab = document.getElementById("all-orders-tab");
  const pendingOrdersTab = document.getElementById("pending-orders-tab");
  const processingOrdersTab = document.getElementById("processing-orders-tab");
  const completedOrdersTab = document.getElementById("completed-orders-tab");
  const cancelledOrdersTab = document.getElementById("cancelled-orders-tab");

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

  let ordersData = [];

  const fetchOrderCounts = async () => {
    try {
      const url = `${API_BASE_URL}/order/order-counts`;
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authorization token found.");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching order counts: ${response.statusText}`);
      }

      const data = await response.json();
      allOrdersCount.textContent = data.total || 0;
      pendingOrdersCount.textContent = data.pending || 0;
      processingOrdersCount.textContent = data.processing || 0;
      completedOrdersCount.textContent = data.shipped || 0;
      cancelledOrdersCount.textContent = data.cancelled || 0;
    } catch (error) {
      console.error("Error fetching order counts:", error);
    }
  };

  const fetchOrders = async (status = "all") => {
    try {
      let url = `${API_BASE_URL}/order`;

      if (status && status.toLowerCase() !== "all") {
        url += `?status=${status.toLowerCase()}`;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authorization token found.");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }

      const data = await response.json();

      ordersData = data.orders;

      displayOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      orderList.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Failed to load orders. Please try again later.</td></tr>`;
    }
  };

  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  }

  const displayOrders = (orders) => {
    orderList.innerHTML = "";

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

    document.querySelectorAll(".invoice-icon").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        const orderId = e.currentTarget.getAttribute("data-order-id");
        showOrderSummary(orderId);
      });
    });

    document.querySelectorAll(".view-order").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const orderId = e.currentTarget.getAttribute("data-order-id");
        showOrderSummary(orderId);
      });
    });

    document.querySelectorAll(".delete-order-btn").forEach((button) => {
      button.addEventListener("click", handleDeleteOrder);
    });
  };

  const showOrderSummary = (orderId) => {
    const order = ordersData.find((order) => order._id === orderId);
    if (!order) return;

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
    productList.innerHTML = "";

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

    orderSummaryModal.style.display = "block";
  };

  closeModalBtn.addEventListener("click", () => {
    orderSummaryModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == orderSummaryModal) {
      orderSummaryModal.style.display = "none";
    }
  });

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
    fetchOrders("Shipped");
  });

  cancelledOrdersTab.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveTab(cancelledOrdersTab);
    fetchOrders("cancelled");
  });

  fetchOrderCounts();
  fetchOrders();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function setActiveTab(activeTab) {
    [
      allOrdersTab,
      pendingOrdersTab,
      processingOrdersTab,
      completedOrdersTab,
      cancelledOrdersTab,
    ].forEach((tab) => {
      tab.classList.remove("active");
    });
    activeTab.classList.add("active");
  }

  const handleDeleteOrder = async (event) => {
    const orderId = event.target.getAttribute("data-order-id");
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
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

  const getCurrentSelectedStatus = () => {
    if (pendingOrdersTab.classList.contains("active")) return "pending";
    if (processingOrdersTab.classList.contains("active")) return "processing";
    if (completedOrdersTab.classList.contains("active")) return "Shipped";
    if (cancelledOrdersTab.classList.contains("active")) return "cancelled";
    return "all";
  };
  window.initializeProfileModals();
});

document.addEventListener("DOMContentLoaded", () => {
  page = "history";
  window.setupPageWebSocket(page);
});
