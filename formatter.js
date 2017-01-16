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
        var data = dataArray.slice(4,parseInt(packetLength, 16)-1);
        console.log(dataArray);
        console.log(data);
        var serialNumber = dataArray[-6]+dataArray[-5];
        var errorCheck = dataArray[-4]+dataArray[-3];
        var stopBit = dataArray[-2] + dataArray[-1];

        if(startbit !="7878" || stopBit != "0D0"){
            return false;
        }
        console.log(data);

        if(protocolNumber == "01"){
            var imei = data.join("");
            return {"type":protocolNumber,"imei":imei};
        }
        else if(protocolNumber == "12"){
            var time = this.time(data.slice(0,6));
            var latitude = this.getCordinate(data.slice(7,11));
            var longitude = this.getCordinate(data.slice(11,15));
            var speed = parseInt(data[15],16);

            return {"type":protocolNumber, "time":time, "latitude":latitude , "longitude":longitude, "speed":speed};
        }
    };

    this.time = function (time) {
        var year = (parseInt(time[0],16)+2000).toString();
        var month = parseInt(time[1],16).toString();
        var day = parseInt(time[2],16).toString();
        var hour = parseInt(time[3],16).toString();
        var minute = parseInt(time[4],16).toString();
        var second = parseInt(time[5],16).toString();

        return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    };

    this.getCordinate = function(point){
        var cordinate  = (parseInt(point.join(""),16)/1800000);
        return cordinate;
    };


};

