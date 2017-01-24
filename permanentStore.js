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
        //sort locations according to date time
        locations.sort(compare);
        //update last location in device document

        //group sorted locations according to history document key
        var locationGroups = groupByKey(locations);
        for(var key in locationGroups) {

             var localKey = key;
             getOneLocationDocument(localKey,function(locationDocument){

                 //add data to the location array
                 locationGroups[localKey].forEach(function(value){
                    locationDocument.location.push(value);
                 });
                 //TODO need to check whether this is blocking or not
                 locationDocument.save();

             })

        }

        //for each location group get the location document , if not create new document
        //add locations to location array in location document

    };
    /*
    this will return location array for given imei number for given time period
    if hour is not given results for full day will be returned
     */
    this.getLocations = function(imei,date,hour){
        hour = hour || null;


    };



    function getOneLocationDocument(key,callback){
        //if location document is not found create new one and return
        //return only one document
    }
    function getLocationDocuments(keyPattern){
        //return matched document array from db
    }

    function createNewLocationDocument(key){

    }


    /**
     * return object format
     * {
     *  'imei:yyyymmddhh': [{location object},{location object},{location object}],
     *  'imei:yyyymmddhh':[{location ...},{location ...}]
     * }
     * @param locations
     */
    function groupByKey(locations){


        locations.forEach(function(value,index){
            //get date time string in (yyyymmddhh) format
            //create the key imei:yyyymmddhh
            //add location object to relevant array


        });

    }

    function compare(a,b) {
        var date1 = new Date(a.dateTime);
        var date2 = new Date(b.dateTime);
        if (date1 < date2)
            return -1;
        if (date1 > date2)
            return 1;
        return 0;
    }





};