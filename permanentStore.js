/**
 * Created by dar on 1/20/17.
 */
module.exports.permanentStore = function() {

    var mongoose = require('mongoose');
    var dbClient = mongoose.connect('mongodb://localhost/database');

    var Device = require('./models/deviceModel');
    var History = require('./models/dataHistoryModel');

    this.get = function(imei,tag,isActive,callback){
        imei = imei || null;tag = tag || null;isActive = isActive || null;

        var quary ={};
        if(imei != null){
            quary.imei = imei;
        }
        if(tag != null){
            quary.tag = tag;
        }
        if(isActive != null){
            quary.isActive = isActive;
        }
        Device.find(quary, function(err, devices) {

            if (err){
                console.log('error occurred while reading active devices ');
                throw err;
            }else {
                callback(devices);
            }
        });

    }


};