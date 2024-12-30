// Định nghĩa hàm WebSocket và gán vào `window`
function setupPageWebSocket(page) {
  const socket = new WebSocket("ws://localhost:3000/" + page);

  // Nhận thông tin số người truy cập từ server
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.page === page) {
      document.getElementById("liveViews").textContent = data.activeVisitors;
    }
  };

  // Xử lý khi WebSocket mở kết nối
  socket.onopen = () => {
    console.log(`Connected to WebSocket server for /${page}`);
  };

  // Xử lý khi WebSocket gặp lỗi
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Xử lý khi WebSocket đóng kết nối
  socket.onclose = () => {
    console.log("WebSocket connection closed for /" + page);
  };
}

// Gán hàm này vào `window` để sử dụng ở các file khác
window.setupPageWebSocket = setupPageWebSocket;