/**
 * Created by shan on 1/16/17.
 */
module.exports.formatter = function(){

    this.format = function (message) {
        var dataArray = message.toString('hex').match(/.{1,2}/g);
        if(dataArray.length <=10){
            return false;
        }
        var startbit = dataArray[0]+dataArray[1];
        var packetLength = dataArray[2];
        var protocolNumber = dataArray[3];
        var data = dataArray.slice(4,parseInt(packetLength, 16)-7);
        var serialNumber = dataArray[-6]+dataArray[-5];
        var errorCheck = dataArray[-4]+dataArray[-3];
        var stopBit = dataArray[-2] + dataArray[-1];
        console.log(data);

        // startbit =



        // console.log(dataArray);
    }


};

