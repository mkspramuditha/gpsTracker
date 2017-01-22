module.exports.controller = function() {

    this.data = "";

    var wss = require('./wsServer');
    var store = require('./temporaryStore.js');
    var httpClient = require('./httpClient.js');
    store = new store.temporaryStore();

    wss = new wss.wsServer();
    httpClient = new httpClient.httpClient();
    
    this.send = function(message){
        temporaryStore(message);
        sendWs(message);
        sendHTTP(message);
    };

    this.setLastData = function (message) {
      setLastData(message);
    };

    function temporaryStore(message,client) {
        // client.set("dsd", message);
        store.store(message);
    }

    function sendWs(message) {
        wss.sendLocation(message)
    }

    function sendHTTP(message){
        httpClient.send(message);
    }

    function setLastData(message) {
        store.setLastData(message);
    }

};
