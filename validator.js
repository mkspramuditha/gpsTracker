module.exports.validator = function(){

    this.deviceList = [];
    this.unknownDeviceList = [];

    this.validate = function (data ) {
        // console.log(message);
        if(this.deviceList.indexOf(data.imei)>-1){
            data.number = this.deviceList[data.imei];
            return data;
        }
        else {
            if(this.unknownDeviceList.indexOf(data.imei)){
                return false;
            }

            if(this.checkDatabase(data.imei)){
                var number  = 1234;
                this.deviceList[data.imei] = number;
                data.number = number;
                return data;
            }
            else{
                return false;
            }
        }
    };

    this.checkDatabase = function (imei) {
        return true;
    }

};

