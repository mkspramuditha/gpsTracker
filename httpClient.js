/**
 * Created by dar on 1/19/17.
 */
module.exports.httpClient = function(){

    var request = require('request');

    this.send = function(message){
        //TODO now all messages are send to all servers
        // sendToTestServer(message);
    };


    function sendToTestServer(message){

        console.log('request send');
        var ignitionStatus;
        if(message.alarm == "POWER_CUT"){
            ignitionStatus = 0;
        }
        else{
            ignitionStatus = 1;
        }
        //request body should be formatted according to this
        var body = { "s":message.imei,"t":message.time,"lg":message.longitude,"lt":message.latitude,"v":message.speed,"d":message.course.course,"l":1,"i":ignitionStatus,"m":0,"al":0.0,"ac":0}

        var options = {
            uri: 'http://localhost:3000/data',
            method: 'POST',
            json: true,
            body: body
        };

        request(options, function (error, response, body) {

            console.log(response.statusCode);

            if (!error && response.statusCode == 200) {
                console.log(body.id); // Print the shortened url.
            }
        });
    }





};