var net = require('net');
var validator= require('./validator.js');
var formatter= require('./formatter.js');
var controller = require('./mainController');

validator = new validator.validator();
formatter = new formatter.formatter();
controller = new controller.controller();

var HOST = '127.0.0.1';
var PORT = 4444;

var clients = {};


net.createServer(function(sock) {

    // console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {
        var addr = sock.remoteAddress+':'+sock.remotePort;

        var formattedObj = formatter.format(data, clients[addr]);
        if(formattedObj.type == "01"){
            clients[addr] = formattedObj.imei;
        }

        validator.validate(formattedObj,function(isValid){
            if(isValid){
                console.log("validate - msg -   "+formattedObj);
                controller.send(formattedObj);
            }else {
                console.log('validation failed for imei : '+formattedObj.imei)
            }
        });
    });

    sock.on('close', function(data) {
        var addr = sock.remoteAddress+':'+sock.remotePort;
        delete clients[addr];
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

