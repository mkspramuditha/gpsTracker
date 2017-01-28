/**
 * Created by shan on 1/22/17.
 */
module.exports.modifier = function() {
    var redis = require('redis');
    var client = redis.createClient(6379,'127.0.0.1');

    var store = require('./temporaryStore.js');
    store = new store.temporaryStore();

        this.modify = function (message,callback) {
        var type = message.type;
        var lastDataObj ;
        store.getLastData(message.imei,function (obj) {
            if(obj == false){
                lastDataObj = {};

            }
            else {
                lastDataObj = obj;
            }

            if(type == '01'){
                callback(false);
            }
            else if(type == '12'){
                lastDataObj.imei = message.imei;
                lastDataObj.connection = 1;
                lastDataObj.gps = {"latitude":message.latitude,"longitude": message.longitude,"speed":message.speed, "course":message.course};
                lastDataObj.dateTime = message.time;
                callback(lastDataObj);
            }
            else if(type == '16'){
                lastDataObj.imei = message.imei;
                lastDataObj.connection = 1;
                lastDataObj.location = {"latitude":message.latitude,"longitude": message.longitude,"speed":message.speed, "course":message.course};
                lastDataObj.dateTime = message.time;
                lastDataObj.status = message.info;
                lastDataObj.status.voltage = message.voltageLevel;
                lastDataObj.status.gsm = message.gsm;
                callback(lastDataObj);
            }
            else if (type == '13'){
                //just update the last location status fields
                //don't send duplicate location

                callback(false);

            }
        });

    }

};