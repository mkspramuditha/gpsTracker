/**
 * Created by dar on 1/19/17.
 */

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'request.log' });

winston.log('info', 'Start test server!');


app.post('/data', function (req, res) {

    console.log('post request');
    console.log(req.body);
    winston.log('info',req.body);
    res.send('Hello World!');
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});