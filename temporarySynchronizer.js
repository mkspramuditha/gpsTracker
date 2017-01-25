/**
 * Created by shan on 1/23/17.
 */
module.exports.temporarySynchronizer = function() {

    var temporaryBuffer = require('./temporaryBuffer.js');
    temporaryBuffer = new temporaryBuffer.temporaryBuffer();
    var permanentStorage = require('./permanentStore.js');
    permanentStorage = new permanentStorage.permanentStore();

    this.synchronize = function () {
        permanentStorage.getDevices(null,null,true,function(devices){
            for(var j =0; j<devices.length;j++){

                var count = j;
                temporaryBuffer.getFromImei(devices[count].imei,function (data) {
                    //TODO add callback
                    permanentStorage.addLocations(devices[count],data);
                    //addToPermanentStore(devices[count],dataArray);
                });
            }
        });
    };

};