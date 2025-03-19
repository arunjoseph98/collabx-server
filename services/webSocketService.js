const WebSocket = require("ws");
const ywsUtils = require('y-websocket/bin/utils')
const setupWSConnection = ywsUtils.setupWSConnection

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  console.log("WebSocket server initialized...");

  wss.on("connection", (ws, req) => {
    const docId = req.url.replace("/", ""); // Extract docId from WebSocket URL
    console.log(req.url);
    
    console.log(`New WebSocket connection for document: ${docId}`);
  
    setupWSConnection(ws, req, { docName: docId });
      // Handle disconnection
      ws.on("close", () => {
        console.log(`WebSocket disconnected from document: ${docId}`);
      });

  });
  
  wss.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  console.log("Y-WebSocket server running...");
}

module.exports = setupWebSocket;



