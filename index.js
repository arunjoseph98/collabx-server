require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./dbConn/dbConnection");

const setupWebSocket = require("./services/webSocketService");

const router = require("./routes/router");
const http = require("http"); // For WebSockets

const collabXserver = express();

collabXserver.use(cors());
collabXserver.use(express.json());
collabXserver.use(router);
collabXserver.use("/uploads", express.static("./uploads"));

const PORT = process.env.PORT || 3000;
const server = http.createServer(collabXserver);

// Start WebSocket server
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`🟢 CollabX server running on port ${PORT}`);
});
