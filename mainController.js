module.exports.controller = function() {

    var redis = require('redis');
    var client = redis.createClient(6379,'127.0.0.1');
    this.data = "";

    var wss = require('./wsServer');
    var store = require('./temporaryStore.js');
    var outRequest = require('./outRequest.js');
    store = new store.temporaryStore();

    wss = new wss.wsServer();
    outRequest = new outRequest.outRequest();
    
    this.send = function(message){
        temporaryStore(message,client);
        sendWs(message);
        sendHTTP(message);
    };

    function temporaryStore(message,client) {
        // client.set("dsd", message);
        store.store(message,client);
    }

    function sendWs(message) {
        wss.sendLocation(message)
    }

    function sendHTTP(message){
        outRequest.send(message);
    }

};
