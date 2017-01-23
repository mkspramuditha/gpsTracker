/**
 * Created by shan on 1/23/17.
 */

var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');

var store = require('./../temporaryStore');
store = new store.temporaryStore();

// store.getFromImei('shan',client,function (data) {
//     console.log(data);
// });
store.removeKeys(['shan1','shan2'],client,function (message) {
    console.log(message);
});