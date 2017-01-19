/**
 * Created by dar on 1/19/17.
 */

var express = require('express');
var app = express();

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'request.log' });

winston.log('info', 'Start test server!');


app.get('/data', function (req, res) {

    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});