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

    this.getOneDevice = function(imei,tag,callback){
        imei = imei || null;tag = tag || null;
        var quary ={};
        if(imei != null){
            quary.imei = imei;
        }
        if(tag != null){
            quary.tag = tag;
        }
        Device.findOne(quary, function(err, device) {

            if (err){
                callback(null);
                console.log('error occurred while reading one device ');
            }else {
                callback(device);
            }
        });

    };

    this.createDevice = function(imei,tag,callback){
        var today = new Date();
        var device = new Device({imei:imei,tag:tag,isActive:true,registeredDate:today,lastEditDate:today});
        device.save(function (err) {
            if(err){
                callback(false);
            }else {
                callback(true);
            }

        })
    };

    this.updateDevice = function (imei,tag,isActive,callback) {
        tag = tag || null; isActive = isActive || null;
        this.getOneDevice(imei,tag,function(device){
            if(device != null){
                if(tag != null){
                    device.tag = tag;
                }
                if(isActive != null){
                    device.isActive = isActive;
                }

                device.lastEditDate = new Date();
                device.save(function (err) {
                    if(err){
                        callback(false);
                    }
                    else{
                        callback(true);
                    }
                })
            }
        });
    };

    this.removeDevice = function () {

    };


    /**
     * functions related to history collection
     */

    this.addLocations = function(device,locations){
        //sort locations according to date time

        locations.sort(compare);
        //update last location in device document
        var lastLocation = locations[locations.length-1];
        device.lastLocation = lastLocation;
        device.save(function (err) {
            if (err){ console.log('device save error');}
        });

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

                 locationDocument.save(function(err){
                     if(err){
                         //TODO add error data to a separate log file
                         console.log(err);
                     }
                 });
             })
        }
        //for each location group get the location document , if not create new document
        //add locations to location array in location document

    };

    /*
        this will return location array for given imei number for given time period
        if hour is not given results for full day will be returned
     */
    this.getLocations = function(imei,date,hour,callback){

        var keyPattern = getKeyPattern(imei,date,hour);
        getLocationDocuments(keyPattern,function(locations){
            if(locations != null){
                var locationsArray = [];
                locations.forEach(function (locDoc) {
                    Array.prototype.push.apply(locationsArray, locDoc.location);
                });
                //TODO need to order locations from date time
                callback(locationsArray);
            }else {
                callback(null);
            }
        });
    };


    /**
     * if location document is not found create new one and return
     * @param key
     * @param callback
     */
    function getOneLocationDocument(key,callback){
        History.findOne({_id:key}, function(err, result) {
            if (err) { /* handle err */ }

            if (result) {
                // we have a result
                callback(result);
            } else {
                // we don't
                callback(createNewLocationDocument(key));
            }});
    }


    function getLocationDocuments(keyPattern,callback){
        //return matched document array from db

        History.find({_id: { $regex: "^"+keyPattern} }, function(err, locations) {
            //Do your action here..
            console.log(locations);

            if(err){
                callback(null);
                console.log('error occurred');
                console.log(err);
            }else {
                callback(locations);
            }
        });
    }

    function createNewLocationDocument(key){
        var split = key.split(':');
        var imei = split[0];
        var date = new Date(split[1].substring(0,4)+'-'+split[1].substring(4,6)+'-'+split[1].substring(6,8));

        var hour = split[1].substring(8);
        var location = [];
        return new History({_id:key,imei:imei,date:date,hour:hour,location:location});
    }

    function getKeyPattern(imei,date,hour){

        var month = date.getMonth()+1;
        month = (month < 10)?'0'+month:''+month;
        var day = date.getDate();
        day = (day < 10)?'0'+day:''+day;
        if(hour != null){
            hour = (hour < 10)?'0'+hour:''+hour;
            return imei+':'+date.getFullYear()+month+day+hour;
        }
        return imei+':'+date.getFullYear()+month+day;

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

        var groups = {};
        locations.forEach(function(location,index){

            var dateTime = new Date(location.dateTime);
            var key = getKeyPattern(location.imei,dateTime,dateTime.getHours());
            //add location object to relevant array
            if(groups.hasOwnProperty(key)){
                groups[key].push(location);
            }else {
                var temparray = [];
                temparray.push(location);
                groups[key]= temparray;
            }
        });
        return groups;

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