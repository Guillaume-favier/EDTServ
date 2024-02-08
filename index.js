const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { log } = require("./logger.js");

log(1, "Starting server");
// create express app
const app = express();

// define a route

app.use("/", express.static("static"));
require("./routes")(app);

log(1, "Starting server on port 443");
https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "ssl/server.key"), "utf-8"),
      cert: fs.readFileSync(path.join(__dirname, "ssl/server.cert"), "utf-8"),
      ca: fs.readFileSync(path.join(__dirname, "ssl/ca.cert"), "utf-8"),
    },
    app,
  )
  .listen(443, () => {
    log(1, "Server started on port 443");
  });
http
  .createServer((req, res) => {
    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url,
    });
    res.end();
  })
  .listen(80, () => {
    log(1, "Server started on port 80");
  });
