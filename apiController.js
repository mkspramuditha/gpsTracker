/**
 * Created by shan on 1/20/17.
 */
var mongoose = require('mongoose');
var express = require('express');

var dbClient = mongoose.connect('mongodb://localhost/my_database');
var app = express();

app.post('/device/add', function (req, res) {
    res.send('add new device');
});

app.post('/device/edit',function (req,res) {
    res.send('edit device');
});

app.post('/device/remove', function (req,res) {
    res.send('remove device');
});



var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});