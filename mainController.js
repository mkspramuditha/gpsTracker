module.exports.controller = function() {

    this.data = "";

    var wss = require('./wsServer');
    var tempStore = require('./temporaryStore.js');
    var httpClient = require('./httpClient.js');
    tempStore = new tempStore.temporaryStore();

    wss = new wss.wsServer();
    httpClient = new httpClient.httpClient();
    
    this.send = function(message){
        temporaryStore(message);
        sendWs(message);
        sendHTTP(message);
    };


    function temporaryStore(message) {
        tempStore.store(message);
    }

    function sendWs(message) {
        wss.sendLocation(message)
    }

    function sendHTTP(message){
        if(message.type == '12'){
            httpClient.send(message);
        }
    }


};
