/**
 * Created by dar on 1/19/17.
 */
module.exports.outRequest = function(){

    var request = require('request');

    this.send = function(message){
        //TODO now all messages are send to all servers
        sendToTestServer(message);
    };


    function sendToTestServer(message){
        console.log('request send');

        var options = {
            uri: 'http://localhost:3000/data',
            method: 'POST',
            json: {
                "longUrl": JSON.stringify(message)
            }
        };

        request('http://localhost:3000/data-test');

        request(options, function (error, response, body) {
            console.log(response.statusCode);

            if (!error && response.statusCode == 200) {
                console.log(body.id); // Print the shortened url.
            }
        });
    }





};