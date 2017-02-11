var net = require('net');
var validator= require('./validator.js');
var formatter= require('./formatter.js');
var controller = require('./mainController');
var modifier = require('./modifier');

validator = new validator.validator();
formatter = new formatter.formatter();
controller = new controller.controller();
modifier = new modifier.modifier();

var HOST = '127.0.0.1';
var PORT = 8888;

var clients = {};


net.createServer(function(sock) {

    // console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {
        var addr = sock.remoteAddress+':'+sock.remotePort;

        var formattedObj = formatter.format(data, clients[addr]);

        if(formattedObj !== false){
            //update clients map
            if(formattedObj.type == "01"){
                clients[addr] = formattedObj.imei;
            }

            //reply if needed
            if(formattedObj.type == "01"){
                sock.write(formattedObj.response);
            }else if (formattedObj.type == "13"){
                //TODO send response to the client
            }

            validator.validate(formattedObj,function(isValid){
                if(isValid){
                    console.log("validate - msg -   "+formattedObj);
                    modifier.modify(formattedObj,function (modifiedObj) {
                        if(modifiedObj == false){

                        }else{
                            controller.send(modifiedObj);
                        }
                    });

                }else {
                    console.log('validation failed for imei : '+formattedObj.imei)
                }
            });

        }

    });

    sock.on('close', function(data) {
        var addr = sock.remoteAddress+':'+sock.remotePort;
        delete clients[addr];
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

