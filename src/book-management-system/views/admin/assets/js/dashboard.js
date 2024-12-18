// Dữ liệu cho biểu đồ
const data = {
  labels: ["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4", "Ngày 5"], // Nhãn cho trục X
  datasets: [
    {
      label: "Doanh thu",
      data: [1000, 1500, 1300, 1800, 2000], // Dữ liệu doanh thu
      backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền của cột
      borderColor: "rgba(75, 192, 192, 1)", // Màu viền của cột
      borderWidth: 1, // Độ dày viền
    },
  ],
};

// Tạo chart với các tuỳ chọn
const config = {
  type: "line", // Loại biểu đồ (line chart)
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Ngày",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VND)",
        },
      },
    },
  },
};

// Vẽ biểu đồ lên canvas
const ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx, config);
