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
        tag: tag,
        isActive : true
    });

    device.save(function(err) {
        if (err) throw err;

        response.send('New device added IMEI: '+imei+", TAG : "+ tag);
    });
});

app.post('/device/edit',function (request,response) {

    var imei = request.query.imei;
    var tag = request.query.tag;

    Device.findOne({ imei: imei  }, function(err, device) {
        if (err) throw err;

        device.tag = tag;

        device.save(function(err) {
            if (err) throw err;
            response.send('Device update IMEI: '+imei+', TAG : '+ tag);
        });
    });
});

app.post('/device/remove', function (request,response) {

    var imei = request.query.imei;
    Device.findOne({ imei: imei},function (err,device) {
        if (err) throw err;

        device.isActive = false;

        device.save(function (err) {
            if(err) throw err;
            response.send('Device removed successfully IMEI : '+imei);
        })

    });
});



var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});