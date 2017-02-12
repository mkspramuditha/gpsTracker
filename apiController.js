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

app.post('/device/add', function (req, res) {
    var imei = req.body.imei;
    var tag = req.body.tag;

    permanentStore.createDevice(imei,tag,function (cb) {
        if(cb){
            res.json({"statusCode" : "S100", "statusDetail": "device added successfully - IMEI : "+imei});
        }
        else{
            res.json({"statusCode": "E100", "statusDetail": "error while adding device - IMEI : "+imei});
        }
    });

});

app.post('/device/edit',function (req,res) {

    var imei = req.body.imei;
    var tag = req.body.tag;

    permanentStore.updateDevice(imei,tag,null,function (cb) {
       if(cb){
           res.json({"statusCode" : "S110", "statusDetail": "device updated successfully - IMEI : "+imei});
       }
       else{
           res.json({"statusCode": "E110", "statusDetail": "error while updating device - IMEI : "+imei});
       }
    });

});

app.get('/device/get',function(req,res){
    //return device for given tag
    var tag = req.query.tag;
    permanentStore.getOneDevice(null,tag,function (device) {
        if(device){
            res.json({"statusCode" : "S120", "statusDetail": "device get successfully - IMEI : "+imei,"device":device});
        }
        else {
            res.json({"statusCode": "E120", "statusDetail": "error while getting device - IMEI : "+imei});

        }

    })
});

app.get('/device/get-all',function(){
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

app.get('/location/recent',function(req,res){
    //this will get recent locations from temporary storage

    //TODO this should pass tag not imei
    var imei = req.query.imei;

    temporaryStore.getFromImei(imei,function (data) {
        if(data){
            res.json({"statusCode" : "S300", "statusDetail": "location request success for - IMEI : "+imei,"data":data});
        }
        else{
            res.json({"statusCode" : "E300", "statusDetail": "error in recent location request for - IMEI : "+imei});
        }
    })

});


app.get('/location/history',function(req,res){
    //this will return locations from permanent storage for given date
    var imei = req.query.imei;
    var date = new Date(req.query.date);
    var hour = null;
    if(typeof req.query.hour !== "undefined"){
        hour = parseInt(req.query.hour);
    }
    permanentStore.getLocations(imei,date,hour,function (locations) {
        if(locations){
            res.json({"statusCode" : "S310", "statusDetail": "location request success for - IMEI : "+imei,"data":locations});
        }
        else{
            res.json({"statusCode" : "E310", "statusDetail": "error getting data for - IMEI : "+imei});
        }
    })
});


var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});