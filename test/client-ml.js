var net = require('net');

var client = new net.Socket();


client.connect(6789, '127.0.0.1', function() {
    console.log('Connected');

    // y
    var data1 = {
        applicationId: 'a5566156',
        groupId: 'a5566156',
        deviceId: 'd0667560',
        mlDeviceId: 'm6579313',
        message: "{\"temp\":\"3\"}"
    };

    // x
    var data2 = {
        applicationId: 'a5566156',
        groupId: 'a5566156',
        deviceId: 'd9769536',
        mlDeviceId: 'm6579313',
        message: "{\"temp\":\"4\"}"
    };

    client.write(JSON.stringify(data1)+'\n',function () {
        client.write(JSON.stringify(data2)+'\n',function () {

        });
    });

    // client.destroy();
});

client.on('data', function(data) {
    console.log(data);

});

client.on('close', function() {
    console.log('Connection closed');
});
