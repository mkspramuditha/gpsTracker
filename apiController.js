/**
 * Created by shan on 1/20/17.
 */
var mongoose = require('mongoose');
var express = require('express');

var Device = require('./models/deviceModel');

var dbClient = mongoose.connect('mongodb://localhost/database');
var app = express();

app.post('/device/add', function (request, response) {
    var imei = request.query.imei;
    var tag = request.query.tag;

    var device = new Device({
        imei: imei,
        tag: tag
    });

    device.save(function(err) {
        if (err) throw err;

        response.send('New device added IMEI: '+imei+", TAG : "+ tag);
    });
});

app.post('/device/edit',function (request,response) {

    var imei = request.query.imei;
    var tag = request.query.tag;

    Device.find({ imei: imei  }, function(err, device) {
        if (err) throw err;

        device.tag = tag;

        device.save(function(err) {
            if (err) throw err;
            response.send('edit device');
        });
    });
});

app.post('/device/remove', function (req,res) {
    res.send('remove device');
});



var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});