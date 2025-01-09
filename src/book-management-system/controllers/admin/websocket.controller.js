const {
  increaseVisitorCount,
  decreaseVisitorCount,
} = require("./visitor.controller");

function setupWebSocket(wss) {
  wss.on("connection", (ws, req) => {
    const page = req.url.replace("/", "");

    increaseVisitorCount(page).then((activeVisitors) => {
      broadcastVisitorCount(wss, page, activeVisitors);
    });

    ws.on("close", () => {
      decreaseVisitorCount(page).then((activeVisitors) => {
        broadcastVisitorCount(wss, page, activeVisitors);
      });
    });
  });
}

function broadcastVisitorCount(wss, page, count) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ page, activeVisitors: count }));
    }
  });
}

module.exports = { setupWebSocket };
