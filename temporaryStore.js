/**
 * Created by shan on 1/17/17.
 */
module.exports.temporaryStore = function() {

    var redis = require('redis');
    var client = redis.createClient(6391,'127.0.0.1');
    // var client = redis.createClient(6380,'127.0.0.1');
    var cursor = '0';

    var keyArray = [];

    this.store = function (data) {
        addToRedis(data);
        setLastData(data);
    };

    function setLastData(message) {
        var key = "l:"+message.imei;
        client.set(key, JSON.stringify(message));
    }

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

    // function addToRedis(data) {
    //
    //     //TODO date time should be get from message not from the server receive time
    //     var timeNow = new Date();
    //     var year = timeNow.getYear();
    //     var month = timeNow.getMonth()+1;
    //     var date = timeNow.getDate();
    //     var hour = timeNow.getHours();
    //     var minute = timeNow.getMinutes();
    //     var second = timeNow.getSeconds();
    //     var dateTime = year+month+date+hour+minute+second;
    //     var key = data.imei+":"+dateTime;
    //     client.set(key, JSON.stringify(data));
    // }


    function addToRedis(data) {
        var timeNow = new Date();
        var key = getRedisKey(data.imei,timeNow);
        client.set(key, JSON.stringify(data));
    }

    function getRedisKey(imei,date){

        var year = date.getFullYear();
        var month = (date.getMonth()+1);
        month = (month<10)?'0'+month:''+month;
        var day = date.getDate();
        day = (day<10)?'0'+day:''+day;
        var hour = date.getHours();
        hour = (hour<10)?'0'+hour:''+hour;
        var minute = date.getMinutes();
        minute = (minute<10)?'0'+minute:''+minute;
        var second = date.getSeconds();
        second = (second<10)?'0'+second:''+second;
        return imei+':'+year+month+day+hour+minute+second;

    }

    this.findFromTimeRange = function (startDate, endDate , type) {
        client.keys('*', function (err, keys) {
            if (err) return console.log(err);
            for(var i = 0, len = keys.length; i < len; i++) {
                console.log(keys[i]);
            }
        });
    };

    this.getLocations = function (imei,callback) {
        this.getFromImei(imei,function (data) {
            if(data){
                callback(data);
            }
            else{
                callback(false);
            }
        })
    };


    this.getFromImei = function (imei,callback) {
        var data = [];
        var dataArray = [];
        var count = 0;
        search(imei,data,function (data) {
            var keyArray=[];
            console.log(data);
            if(data.length ==0){
                console.log('no-data');
                callback(null);
            }
            for(var i=0;i<data.length;i++)
            {
                keyArray.push(data[i]);
                // console.log(i);
                var temp = data[i];
                //var tempValue = null;
                client.get(temp, function(err, reply) {
                    console.log(reply);
                    //tempValue = {"key":temp, "location":JSON.parse(reply)};
                    dataArray.push(JSON.parse(reply));
                    count+=1;
                    if (count == data.length){
                        callback(dataArray);
                        //TODO remove returned data
                    }
                });
            }
        });
    };


    function search (value,data,callback) {
        client.scan(
            cursor,
            'MATCH', value+'*',
            'COUNT', '10',
            function (err, res) {
                if (err) throw err;
                // Update the cursor position for the next scan
                cursor = res[0];
                // get the SCAN result for this iteration
                var keys = res[1];
                if (keys.length > 0) {
                    data = data.concat(keys);
                }
                if (cursor === '0') {
                    callback(data);
                    return null;
                }
                return search(value,data,callback);
            }
        );
    }









};