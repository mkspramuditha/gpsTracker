var net = require('net');
var validator= require('./validator.js');
var formatter= require('./formatter.js');

validator = new validator.validator();
formatter = new formatter.formatter();

var HOST = '127.0.0.1';
var PORT = 4444;

validator.validate("sd");

net.createServer(function(sock) {


    // console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {

        formatter.format(data);

    });

    sock.on('close', function(data) {
        // console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

