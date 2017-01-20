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

        //request body should be formatted according to this
        var body = { "s":"imei number","t":"yyyy-mm-dd hh:mm:ss","lg":"longitude","lt":"latitude","v":"speed km/h","d":"direction 0-359 degrees (a.k.a azimuth)","l":"1-GPS,0-GPRS","i":"1-on,0-off","m":"mileage()","al":"altitude","ac":"acceleration"}

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