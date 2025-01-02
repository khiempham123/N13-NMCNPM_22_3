// Hàm gọi API để lấy dữ liệu doanh thu
async function fetchRevenueData(startDate, endDate) {
  try {
    const response = await fetch(`http://localhost:3000/admin/report?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    // Chuyển đổi dữ liệu API thành định dạng cho biểu đồ
    const labels = data.map(item => item._id); // Ngày
    const revenue = data.map(item => item.totalRevenue); // Doanh thu

    updateChart(labels, revenue);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
  }
}

let chartInstance; // Biến lưu trữ biểu đồ hiện tại

// Hàm cập nhật biểu đồ
function updateChart(labels, revenue) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          title: { display: true, text: "Date" },
        },
        y: {
          title: { display: true, text: "Revenue (USD)" },
        },
      },
    },
  };

  const ctx = document.getElementById("myChart").getContext("2d");

  // Phá hủy biểu đồ hiện tại (nếu có)
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Tạo biểu đồ mới
  chartInstance = new Chart(ctx, config);
}

// Hàm xử lý khi nhấn nút Load Report
function loadReport() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  if(startDate > endDate){
    alert("Khoảng thời gian không hợp lệ.");
    return;
  }
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  fetchRevenueData(startDate, endDate);
}

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today); // Tạo bản sao của `today`
  thirtyDaysAgo.setDate(today.getDate() - 30); // Lùi lại 30 ngày

  // Thiết lập giá trị mặc định cho các ô ngày
  document.getElementById("startDate").value = thirtyDaysAgo.toISOString().split("T")[0];
  document.getElementById("endDate").value = today.toISOString().split("T")[0];

  // Gọi hàm loadReport để tải dữ liệu mặc định
  loadReport();
});





const API_URL = "http://localhost:3000/staff/order?page=";
const limit = 5; // Số lượng item trên mỗi trang

// Hàm gọi API và cập nhật dữ liệu
function fetchOrders(page = 1) {
  fetch(`${API_URL}${page}&limit=${limit}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    })
    .then(data => {
      renderOrderTable(data.orders); // Cập nhật bảng với dữ liệu mới
      renderOrderPagination(data.totalPages, page); // Cập nhật phân trang
    })
    .catch(error => {
      console.error("Error fetching orders:", error);
    });
}

// Hàm cập nhật bảng dữ liệu
function renderOrderTable(orders) {
  const tableBody = document.getElementById("orderTableBody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  orders.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order._id}</td>
      <td>${order.userId}</td>
      <td>$${order.totalAmount.toFixed(2)}</td>
      <td><span class="status ${getStatusClass(order.status)}">${order.status}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

// Hàm chuyển trạng thái sang class CSS
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "pending";
    case "processing":
      return "processing";
    case "packed":
      return "packed";
    case "shipped":
      return "shipped";
    case "canceled":
      return "canceled";
    default:
      return "";
  }
}

// Hàm render phân trang
function renderOrderPagination(totalPages, currentPage) {
  const paginationList = document.getElementById("orderpagination-list");
  paginationList.innerHTML = ""; // Xóa nội dung cũ

  // Nút "Previous"
  const prevButton = document.createElement("li");
  prevButton.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
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
    pageButton.textContent = i; // Hiển thị số trang
    if (currentPage === i) {
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
  nextButton.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  if (currentPage === totalPages) nextButton.classList.add("disabled");
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      fetchOrders(currentPage + 1);
    }
  });
  paginationList.appendChild(nextButton);
}

// Gọi fetchOrders khi trang load
document.addEventListener("DOMContentLoaded", () => fetchOrders(1));

// Gọi API để lấy số liệu thống kê từ server
function fetchVisitorCount() {
  fetch("http://localhost:3000/admin/customer/visitors")
    .then(response => response.json())
    .then(data => {
      document.getElementById("liveViews").textContent = data.total;
    })
    .catch(error => console.error("Error fetching visitors:", error));
}

// Gọi API ngay khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  fetchVisitorCount();

  // Gọi lại API mỗi 5 giây để cập nhật
  setInterval(fetchVisitorCount, 5000);
});

// Gọi API và cập nhật UI
async function updateOrderCount() {
  try {
    const response = await fetch('http://localhost:3000/order/count');
    const data = await response.json();
    const orderCount = data.total;

    // Gắn số lượng orders vào thẻ HTML
    document.getElementById('orderNumbers').textContent = orderCount;
  } catch (error) {
    console.error('Error fetching order count:', error);
  }
}

// Gọi hàm khi trang load
updateOrderCount();


async function fetchTotalShipped() {
  try {
      const response = await fetch('http://localhost:3000/order/total-shipped');
      const data = await response.json();
      document.getElementById('totalShipped').innerText = 
          `${data.totalShipped} $`;
  } catch (error) {
      console.error('Error fetching total shipped:', error);
      document.getElementById('totalShipped').innerText = 
          'Lỗi khi tính tổng tiền!';
  }
}

// Gọi hàm khi trang được tải
fetchTotalShipped();



const updateCommentCount = async () => {
  try {
    const response = await fetch('http://localhost:3000/contact/count-comment');
    const result = await response.json();

    if (response.ok) {
      document.getElementById('comment-count').textContent = result.count;
    } else {
      console.error('Failed to fetch comment count:', result.error);
    }
  } catch (error) {
    console.error('Error fetching comment count:', error);
  }
};

// Initialize comment count update
updateCommentCount();