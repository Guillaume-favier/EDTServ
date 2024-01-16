const dev = true
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path")
const express = require('express');
const {log} = require("./logger.js")

log(1,"Starting server")
// create express app
const app = express();


// define a route

app.use('/', express.static('static'))
require('./routes')(app);

app.get('/', (req, res) => {
    res.send('Hello World');
});

if (dev) {
    // listen for requests
    log(1,"Starting server on port 80 because it's in dev mode")
    http.createServer(app).listen(80, () => {
        log(1, "Server started on port 80")
    });
}else{
    log(1, "Starting server on port 443 because it's in production mode")
    https.createServer({
        key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl/server.cert'))
    }, app).listen(443, () => {
        log(1,"Server started on port 443")
    });
}