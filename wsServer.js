/**
 * Created by shan on 1/17/17.
 */

module.exports.wsServer = function() {

    var jwt = require('jsonwebtoken');
    var token = jwt.sign({name: 'shan'}, 'secret-key');

    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({
        port: 8080,
        verifyClient: function (info, cb) {
            var token = info.req.headers.token;
            if (!token) {
                console.log("no token");
                cb(false, 401, 'Unauthorized');
            }
            else {
                jwt.verify(token, 'secret-key', function (err, decoded) {
                    if (err) {
                        console.log("unauthorized");
                        cb(false, 401, 'Unauthorized');
                    } else {
                        console.log("ok");
                        info.req.user = decoded; //[1]
                        console.log(info.req.user);
                        cb(true)
                    }
                })

            }
        }
    });

    var clients = [];
    wss.on('connection', function connection(ws) {
        var user = ws.upgradeReq.user;
        clients[user.name] = ws;


        // ws.send('Welcome! ' + user.name);

        ws.on('message', function incoming(message) {

        });
    });

    this.sendLocation = function (message) {
        if(clients[message.number] != null){
            clients[message.number].send(message);
        }
    }
};