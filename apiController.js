/**
 * Created by shan on 1/20/17.
 */
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var pStoreFile = require('./permanentStore.js');
var tStoreFile = require('./temporaryStore');
var permanentStore = new pStoreFile.permanentStore();
var temporaryStore = new tStoreFile.temporaryStore();

app.post('/device/add', function (request, response) {
    var imei = request.query.imei;
    var tag = request.query.tag;

    permanentStore.createDevice(imei,tag,function (cb) {
        if(cb){
            response.send('device added successfully - IMEI :'+imei);
        }
        else{
            response.send('error adding device');
        }
    });

    
});

app.post('/device/edit',function (request,response) {

    var imei = request.query.imei;
    var tag = request.query.tag;

    permanentStore.updateDevice(imei,tag,null,function (cb) {
       if(cb){
           response.send('Device updated successfully - IMEI :'+imei);
       }
       else{
           response.send('error updating device');
       }
    });

    // Device.findOne({ imei: imei  }, function(err, device) {
    //     if (err) throw err;
    //
    //     device.tag = tag;
    //
    //     device.save(function(err) {
    //         if (err) throw err;
    //         response.send('Device update IMEI: '+imei+', TAG : '+ tag);
    //     });
    // });
});

app.post('/device/get',function(request,response){
    //return device for given tag
    var tag = request.query.tag;
    permanentStore.getOneDevice(null,tag,function (device) {
        if(device){
            response.send(device)
        }
        else {
            response.send('error getting device');
        }

    })
});

app.post('/device/get-all',function(){
    //return all devices for given app
});

app.post('/device/activate', function (request, response) {
    var imei = response.query.imei;
    permanentStore.updateDevice(imei, null,true,function (cb) {
        if(cb){
            response.send('Device activated successfully - IMEI :'+imei);
        }
        else{
            response.send('Device activation failed');
        }
    })
});
app.post('device/deactivate',function(){
    var imei = response.query.imei;
    permanentStore.updateDevice(imei, null,false,function (cb) {
        if(cb){
            response.send('Device deactivated successfully - IMEI :'+imei);
        }
        else{
            response.send('Device deactivation failed');
        }
    })

});

// app.post('/device/remove', function (request,response) {
//
//     var imei = request.query.imei;
//     Device.findOne({ imei: imei},function (err,device) {
//         if (err) throw err;
//
//         device.isActive = false;
//
//         device.save(function (err) {
//             if(err) throw err;
//             response.send('Device removed successfully IMEI : '+imei);
//         })
//
//     });
// });

////////////////////////////////////////////
/////////actions for location api///////////

app.post('/location/recent',function(req,res){
    //this will get recent locations from temporary storage
    var body = req.body;
    var imei = body.imei;
    temporaryStore.getFromImei(imei,function (data) {
        if(data){
            res.send(data);
        }
        else{
            res.send('no data available for the given IMEI : '+imei);
        }
    })

});
app.post('/location/history',function(req,res){
    //this will return locations from permanent storage for given date
    var body = req.body;

    console.log(body);

    var imei = body.imei;
    var date = new Date(body.date);
    var hour = null;
    if(typeof body.hour !== "undefined"){
        hour = parseInt(body.hour);
    }
    permanentStore.getLocations(imei,date,hour,function (locations) {
        if(locations){
            res.send(locations);
        }
        else{
            res.send('error getting data - /location/history');
        }
    })
});


var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});