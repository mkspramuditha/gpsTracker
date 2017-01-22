/**
 * Created by shan on 1/17/17.
 */
module.exports.temporaryStore = function() {

    var redis = require('redis');
    var client = redis.createClient(6379,'127.0.0.1');

    this.store = function (data) {
        addToRedis(data,client);
    };

    this.getLastLocation = function(imei,callback){

    };

    this.getTodayLocationHistory = function(imei,callback){

    };

    this.getLocationHistory = function(imei,callback){

    };

    this.getLastStatus = function (imei,callback) {

    };

    this.getTodayStatusHistory = function (imei,callback) {

    };

    this.getStatusHistory = function (imei,callback) {

    };

    function addToRedis(data, client) {

        //TODO date time should be get from message not from the server receive time
        var timeNow = new Date();
        var year = timeNow.getYear();
        var month = timeNow.getMonth()+1;
        var date = timeNow.getDate();
        var hour = timeNow.getHours();
        var minute = timeNow.getMinutes();
        var second = timeNow.getSeconds();
        var dateTime = year+month+date+hour+minute+second
        var key = data.imei+":"+data.type+":"+dateTime;
        client.set(key, JSON.stringify(data));
    }

    this.findFromTimeRange = function (startDate, endDate , type) {
        client.keys('*', function (err, keys) {
            if (err) return console.log(err);
            for(var i = 0, len = keys.length; i < len; i++) {
                console.log(keys[i]);
            }
        });

    }



};