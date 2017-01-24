/**
 * Created by dar on 1/20/17.
 */
module.exports.permanentStore = function() {

    var mongoose = require('mongoose');
    var dbClient = mongoose.connect('mongodb://localhost/database');

    var Device = require('./models/deviceModel');
    var History = require('./models/dataHistoryModel');

    this.getDevices = function(imei,tag,isActive,callback){
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
    };

    this.getOneDevice = function(imei,tag){
        imei = imei || null;tag = tag || null;
    };

    this.createDevice = function(){

    };

    this.updateDevice = function () {

    };
    this.removeDevice = function () {

    };


    /**
     * functions related to history collection
     */

    this.addLocations = function(imei,locations){
        var locationGroups = groupByHour(locations);
        locationGroups.forEach(function(value,index){

        });
        //for each location group get the location document , if not create new document
        //add locations to location array in location document

    };
    /*
    if hour is not given results for full day will be returned
     */
    this.getLocations = function(imei,date,hour){
        hour = hour || null;
    };



    function getOneLocationDocuent(key){
        //if location document is not found create new one and return
        //return only one document
    }
    function getLocationDocuments(keyPattern){
        //return matched document array
    }

    function createNewLocationDocument(key){

    }


    function groupByHour(locations){

    }





};