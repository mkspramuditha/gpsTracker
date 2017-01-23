/**
 * Created by shan on 1/23/17.
 */

module.exports.temporaryBuffer = function() {
    var redis = require('redis');
    var client = redis.createClient(6380,'127.0.0.1');
    var keyArray = [];

    this.storeToBuffer = function (message) {
      addToRedis(message);

    };


    this.getFromImei = function (imei,callback) {
        var data = [];
        var dataArray = [];
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
                var tempValue = null;
                client.get(temp, function(err, reply) {
                    console.log(reply);
                    tempValue = {"key":temp, "location":JSON.parse(reply)};
                    dataArray.push(tempValue);
                    count+=1;
                    if (count == data.length){
                        console.log('sdsd');
                        callback(dataArray);
                        // PostCode(send);
                        console.log(send.length);
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