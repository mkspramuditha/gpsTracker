module.exports.controller = function() {

    this.data = "";

    var wss = require('./wsServer');
    var tempStore = require('./temporaryStore.js');
    var tempBuffer = require('./temporaryBuffer');
    var httpClient = require('./httpClient.js');
    tempStore = new tempStore.temporaryStore();
    tempBuffer = new tempBuffer.temporaryBuffer();

    wss = new wss.wsServer();
    httpClient = new httpClient.httpClient();
    
    this.send = function(message){

        temporaryStore(message);
        sendWs(message);
        sendHTTP(message);
        tempBuffer.storeToBuffer(message);
    };


    function temporaryStore(message) {
        tempStore.store(message);
    }

    function sendWs(message) {
        wss.sendLocation(message)
    }

    function sendHTTP(message){
        httpClient.send(message);
    }


};
