var net = require('net');

var client = new net.Socket();
var value12 = '78781f12100a100d1408c70211111100322222003401019d01cb20002e02000db1b20d0a';
var value16 = '787825160B0B0F0E241DCF027AC8870C4657E60014020901CC00287D001F726506040101003656A40D0A';
var value13 = '787808134B040300010011061F0D0A';
var value1 = '78780d0103554880201067640004b1bb0d0a';
client.connect(8888, '127.0.0.1', function() {

    console.log('Connected');

    checkValue1216();

    // client.write(new Buffer(value1, 'hex'),function () {
    //     client.write(new Buffer(value12, 'hex'),function () {
    //         client.write(new Buffer(value13,'hex'),function () {
    //            client.write(new Buffer(value12,'hex'),function () {
    //                client.destroy();
    //
    //            });
    //         });
    //     });
    // });

});


function checkValue1213() {

    client.write(new Buffer(value1, 'hex'),function (res1) {

        console.log('response for type : 01');
        console.log(res1);

        client.write(new Buffer(value12, 'hex'),function () {

            setTimeout(function() {

                client.write(new Buffer(value13,'hex'),function (res13) {
                    console.log('response for type : 13');
                    console.log(res13);

                    client.write(new Buffer(value12,'hex'),function () {
                        client.destroy();
                    });
                });

            }, 1000);


        });
    });
}

function checkValue1216() {

    client.write(new Buffer(value1, 'hex'),function (res1) {

        console.log('response for type : 01');
        console.log(res1);

        client.write(new Buffer(value12, 'hex'),function () {

            setTimeout(function() {

                client.write(new Buffer(value16,'hex'),function (res13) {
                    console.log('response for type : 13');
                    console.log(res13);

                    client.write(new Buffer(value12,'hex'),function () {
                        client.destroy();
                    });
                });

            }, 1000);


        });
    });
}

client.on('data', function(data) {
    console.log(data);
});

client.on('close', function() {
    console.log('Connection closed');
});
