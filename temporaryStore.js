/**
 * Created by shan on 1/17/17.
 */
module.exports.temporaryStore = function() {

    var redis = require('redis');
    var client = redis.createClient(6379,'127.0.0.1');

    this.store = function (data) {
        addToRedis(data,client);
        setLastData(data);
    };

    function setLastData(message) {
        var key = "l:"+message.imei;
        client.set(key, JSON.stringify(message));
    };

    this.getLastData = function (imei,callback) {
        var key = "l:"+imei;
        client.get(key,function (err, value) {
            if(value == null){
                callback(false);
            }else {
                callback(JSON.parse(value));
            }
        });
    };


    this.getTodayLocationHistory = function(imei,callback){

    };

    this.getLocationHistory = function(imei,callback){

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