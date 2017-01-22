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
            lastDataObj = obj;

            if(type == '01'){
                lastDataObj.connection = 1;
                lastDataObj.time = message.time;
                callback(lastDataObj);
            }
            else if(type == '12'){
                lastDataObj.location = {"latitude":message.latitude,"longitude": message.longitude,"speed":message.speed, "course":message.course};
                lastDataObj.time = message.time;
                callback(lastDataObj);
            }
            else if(type == '16'){
                lastDataObj.location = {"latitude":message.latitude,"longitude": message.longitude,"speed":message.speed, "course":message.course};
                lastDataObj.time = message.time;
                lastDataObj.status = message.info;
                callback(lastDataObj);
            }
        });

    }

};