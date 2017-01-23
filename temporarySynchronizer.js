/**
 * Created by shan on 1/23/17.
 */
module.exports.temporarySynchronizer = function() {

    var redis = require('redis');
    var client = redis.createClient(6380,'127.0.0.1');
    var Device = require('./models/deviceModel');
    var History = require('/models/dataHistoryModel');

    var data = [];

    this.synchronize = function () {
        Device.find({active: true}, function(err, data) {
            if (err) throw err;
            for(var j =0; j<data.length;j++){
                getAllValues(data[i].imei,function (data) {
                    var dataArray = data;
                    dataArray.sort(compare);
                    addToPermanentStore(dataArray);

                })
            }
        });

    };

    function addToPermanentStore(data) {


    }

    function getAllValues(imei,callback) {
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
    }


    function scan (imei,data,callback) {
        console.log('sds');
        client.scan(
            cursor,
            'MATCH', imei+'*',
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

    function compare(a,b) {
        if (a.dateTime < b.dateTime)
            return -1;
        if (a.dateTime > b.dateTime)
            return 1;
        return 0;
    }


};