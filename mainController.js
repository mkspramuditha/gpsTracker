module.exports.controller = function() {

    var redis = require('redis');
    var client = redis.createClient(6379,'127.0.0.1');
    this.data = "";
    
    
    this.store = function (data) {
        client.set("dsd", data);
    };
    
    this.sendWS = function (data, ) {
        
    }

};
