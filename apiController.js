/**
 * Created by shan on 1/20/17.
 */
var mongoose = require('mongoose');
var express = require('express');

var permanantStore = require('./permanentStore');
var temporaryStore = require('./temporaryStore');
permanantStore = permanantStore.permanentStore();
temporaryStore = temporaryStore.temporaryStore();
var app = express();

//resource server APIs

app.post('/device/add', function (request, response) {
    var imei = request.query.imei;
    var tag = request.query.tag;

    permanantStore.createDevice(imei,tag,function (cb) {
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

    permanantStore.updateDevice(imei,tag,null,function (cb) {
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
    permanantStore.getOneDevice(null,tag,function (device) {
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
    permanantStore.updateDevice(imei, null,true,function (cb) {
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
    permanantStore.updateDevice(imei, null,false,function (cb) {
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
app.post('/location/recent',function(request,response){
    //this will get recent locations from temporary storage
    var imei = request.query.imei;
    temporaryStore.getFromImei(imei,function (data) {
        if(data){
            response.send(data);
        }
        else{
            response.send('no data avaailable for the given IMEI : '+imei);
        }
    })
});
app.post('/location/history',function(request,response){
    //this will return locations from permanent storage for given date
    var imei = request.query.imei;
    var date = new Date(request.query.date);
    var hour = parseInt(request.query.hour);
    permanantStore.getLocations(imei,date,hour,function (locations) {
        if(locations){
            response.send(locations);
        }
        else{
            response.send('error getting data - /location/history');
        }
    })
});


var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});