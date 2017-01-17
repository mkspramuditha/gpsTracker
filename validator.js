module.exports.validator = function(){

    this.deviceList = [];
    this.unknownDeviceList = [];

    this.validate = function (data , emie) {
        // console.log(message);
        if(this.deviceList.indexOf(emie)>-1){
            data.number = this.deviceList[emie];
            return data;
        }
        else {
            if(this.unknownDeviceList.indexOf(emie)){
                return false;
            }

            if(this.checkDatabase(emie)){
                var number  = 1234;
                this.deviceList[emie] = number;
                data.number = number;
                return data;
            }
            else{
                return false;
            }
        }
    };

    this.checkDatabase = function (emie) {
        return true;
    }

};

