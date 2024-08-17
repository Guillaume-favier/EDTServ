const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { log } = require("./logger");
log(1, "Starting server");


const app = express();

app.use("/", express.static("static")); // fichiers statics
require("./routes")(app); // utilise le fichiers routes.js pour définir les appels api

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

// redirecte les requêtes http vers la version https
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
