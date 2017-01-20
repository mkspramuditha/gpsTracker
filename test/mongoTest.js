/**
 * Created by shan on 1/20/17.
 */

var mongoose = require('mongoose');
var dbClient = mongoose.connect('mongodb://localhost/database');

var Device = require('./../models/deviceModel');

var device = new Device({
    imei: 'test imei',
    tag: 'test tag'
});

device.save(function(err) {
    if (err) throw err;

    console.log('Device saved successfully!');
});

Device.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
});