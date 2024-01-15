const express = require('express');


// create express app
const app = express();


// define a route

app.use('/', express.static('static'))
require('./routes')(app);

app.get('/', (req, res) => {
    res.send('Hello World');
});


// listen for requests
app.listen(80, () => {
    console.log('Server is listening on port 3000');
});