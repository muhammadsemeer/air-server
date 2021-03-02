// Modules Importoing
const express = require("express");
const app = express();
const http = require("http");
const db = require("./config/connection");

// Server Port Setting
const port = process.env.PORT || 3001;
app.set("port", port);

// Create Http Server
const server = http.createServer(app);

// Database Connetcion
db.connect((error) => {
  if (error) throw error
  console.log("Database Connected");
})

// Server Listen
server.listen(port);
server.on("listening", () => {
  console.log(`Server is Running on ${port}`);
});
