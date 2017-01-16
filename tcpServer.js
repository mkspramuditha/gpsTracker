var net = require('net');
var validator = require('./validator.js');

var HOST = '127.0.0.1';
var PORT = 6969;

console.log(validator.deviceList);

net.createServer(function(sock) {


    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {

        console.log(data);

    });

    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

