const dev = true
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path")
const express = require('express');


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
    http.createServer(app).listen(80, () => {
        console.log("Server is listening on port 80");
    });
}else{
    https.createServer({
        key: fs.readFileSync(path.join(__dirname, 'ssl/server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl/server.cert'))
    }, app).listen(443, () => {
        console.log("Server is listening on port 443");
    });
}