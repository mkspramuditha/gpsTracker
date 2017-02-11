/**
 * Created by shan on 1/23/17.
 */

module.exports.temporaryBuffer = function() {
    var redis = require('redis');
    var client = redis.createClient(6390,'127.0.0.1');
    var keyArray = [];

    var cursor = '0';

    this.storeToBuffer = function (message) {
      addToRedis(message);

    };

    this.getFromImei = function (imei,callback) {
        var data = [];
        var dataArray = [];
        var count = 0;
        scan(imei,data,function (data) {
            var keyArray=[];
            console.log(data);
            if(data.length ==0){
                console.log('no-data');
                process.exit()
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

    this.removeKeys = function (keys,callback) {
        client.del(keys,function (test) {
            callback(true);
        });
    };

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

    function scan (value,data,callback) {
        console.log('sds');
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
                return scan();
            }
        );
    }

};