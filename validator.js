module.exports.validator = function(){

    //device has two identities one is imei and other is unique tag ( which is used to
    // identify device by other systems which don't need to know about device imei number )
    // this device array should be a map of these two unique values ( imei(key) => tag(unique number) )
    var deviceList = [];
    // resent unknown imei numbers
    //TODO add mechanism to auto remove unknown devices after 10 minutes
    var unknownDeviceList = [];

    this.validate = function (data,callback) {
        // console.log(message);
        // console.log(data);
        if(data.imei in deviceList){
            data.number = deviceList[data.imei];
            callback(true);
        }
        else {
            if(unknownDeviceList.indexOf(data.imei)<-1){
                callback(false);
            }else {
                checkDatabase(data.imei,function(isExist){
                    if(isExist){
                        var number  = 1234;
                        deviceList[data.imei] = number;
                        data.number = number;
                        callback(true);
                    }else {
                        callback(false);
                    }
                })
            }


        }
    };

    function checkDatabase(imei,callback) {
        //TODO implement db check functionality
        //this is a asynchronous function so only possible way is callback
        callback(true);
    }

};

