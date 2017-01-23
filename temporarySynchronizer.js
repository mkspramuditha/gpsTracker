/**
 * Created by shan on 1/23/17.
 */
module.exports.temporarySynchronizer = function() {

    //var mongoose = require('mongoose');
    //var dbClient = mongoose.connect('mongodb://localhost/database');

    var redis = require('redis');
    var client = redis.createClient(6380,'127.0.0.1');


    var Device = require('./models/deviceModel');
    var History = require('./models/dataHistoryModel');

    var permanentStorage = require('./permanentStore.js');
    permanentStorage = new permanentStorage.permanentStore();

    var data = [];
    var cursor = '0';
    this.synchronize = function () {


        permanentStorage.get(null,null,true,function(devices){
            for(var j =0; j<devices.length;j++){

                var count = j;
                getAllValues(devices[j].imei,function (data) {
                    var dataArray = data;
                    dataArray.sort(compare);
                    addToPermanentStore(devices[count],dataArray);
                })
            }
        });

    };

    function addToPermanentStore(DeviceModel,data) {

        var lastLocation = data[data.length-1].location;
        console.log(lastLocation);

        DeviceModel.lastLocation = lastLocation;

        console.log(DeviceModel);

        DeviceModel.save(function (err) {
            if (err) throw (err);
        });
    }

    function getAllValues(imei,callback) {
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
                var tempValue = null;
                client.get(temp, function(err, reply) {
                    console.log(reply);
                    tempValue = {"key":temp, "location":JSON.parse(reply)};
                    dataArray.push(tempValue);
                    count+=1;
                    if (count == data.length){
                        callback(dataArray);
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