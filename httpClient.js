/**
 * Created by dar on 1/19/17.
 */
module.exports.httpClient = function(){

    var request = require('request');

    this.send = function(message){
        //TODO now all messages are send to all servers

        sendToTestServer(message);

    };


    function sendToTestServer(message){

        console.log('request send');

        var ignitionStatus;
        if(typeof message.status !== 'undefined' && message.status.alarm == "POWER_CUT"){
            ignitionStatus = 0;
        }
        else{
            ignitionStatus = 1;
        }
        //request body should be formatted according to this
        var body = { "s":message.imei,"t":message.time,"lg":message.gps.longitude,"lt":message.gps.latitude,"v":message.gps.speed,"d":message.gps.course.course,"l":1,"i":ignitionStatus,"m":0,"al":0.0,"ac":0}

        var options = {
            uri: 'http://localhost:3000/data',
            method: 'POST',
            json: true,
            body: body
        };

        request(options, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                console.log('send http'); // Print the shortened url.
            }
        });
    }





};