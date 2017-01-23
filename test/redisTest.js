/**
 * Created by shan on 1/23/17.
 */

var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');

client.keys('shan*',function (err, data) {

});