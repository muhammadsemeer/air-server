// Modules Importoing
const express = require("express");
const app = express();
const http = require("http");
const db = require("./config/connection");
const loginRouter = require("./routes/login");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

// Server Port Setting
const port = process.env.PORT || 3001;
app.set("port", port);

// Create Http Server
const server = http.createServer(app);

// Middilewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Database Connetcion
db.connect((error) => {
  if (error) throw error;
  console.log("Database Connected");
});

// Routes
app.use("/login", loginRouter);

// Server Listen
server.listen(port);
server.on("listening", () => {
  console.log(`Server is Running on ${port}`);
});
