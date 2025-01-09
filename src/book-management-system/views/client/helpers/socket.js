function setupPageWebSocket(page) {
  const socket = new WebSocket("ws://localhost:3000/" + page);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.page === page) {
      document.getElementById("liveViews").textContent = data.activeVisitors;
    }
  };

  socket.onopen = () => {
    console.log(`Connected to WebSocket server for /${page}`);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed for /" + page);
  };
}

window.setupPageWebSocket = setupPageWebSocket;
