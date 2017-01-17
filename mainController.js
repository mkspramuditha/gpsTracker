module.exports.controller = function() {

    var redis = require('redis');
    // var client = redis.createClient(6379,'127.0.0.1');
    this.data = "";

    var wss = require('./wsServer');

    wss = new wss.wsServer();
    
    this.send = function(message){
        temporaryStore(message);
        sendWs(message);
    }

    function temporaryStore(message) {
        // client.set("dsd", message);
    };
    

    function sendWs(message) {
        wss.sendLocation(message)
    }

};
