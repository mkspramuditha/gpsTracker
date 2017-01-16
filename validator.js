module.exports.validator = function(){

    this.deviceList = [];
    this.unknownDeviceList = [];

    this.validate = function (emie) {
        // console.log(message);
        if(this.deviceList.indexOf(emie)>-1){
            return true;
        }
        else {
            if(this.unknownDeviceList.indexOf(emie)){
                return false;
            }

            if(this.checkDatabase(emie)){
                this.deviceList.push(emie);
                return true;
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

