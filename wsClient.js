/**
 * Created by shan on 1/17/17.
 */
WebSocket = require ('ws');
var jwt = require('jsonwebtoken');

var token = jwt.sign({name:'1234'},'secret-key');

ws = new WebSocket ('ws://localhost:8080    ',{
    headers : {
        token: token
    }
});

ws.on('open', function open() {
    console.log('opened');
});

ws.on('message', function(data, flags) {
  console.log(data);
});