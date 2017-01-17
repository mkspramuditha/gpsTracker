/**
 * Created by shan on 1/16/17.
 */
module.exports.formatter = function(){

    this.format = function (message, imeiNo) {
        // console.log(message);
        var dataArray = message.toString('hex').match(/.{1,2}/g);
        if(dataArray.length <=10){
            // console.log("length");
            return false;

        }
        var startbit = dataArray[0]+dataArray[1];
        var packetLength = dataArray[2];
        var protocolNumber = dataArray[3];
        var data = dataArray.slice(4,parseInt(packetLength, 16)-1);
        var length = dataArray.length;
        // console.log(dataArray);
        // console.log(data);
        var serialNumber = dataArray[length-6]+dataArray[length-5];
        var errorCheck = dataArray[length-4]+dataArray[length-3];
        var stopBit = dataArray[length-2] + dataArray[length-1];
        // console.log(dataArray);
        // console.log(startbit);
        // console.log(stopBit);

        if(startbit !="7878" || stopBit != "0d0a"){
            // console.log("startbit");
            return false;

        }
        // console.log(data);

        if(protocolNumber == "01"){
            var imei = data.join("");
            return {"type":protocolNumber,"imei":imei};
        }
        else if(protocolNumber == "12"){
            var time = getTime(data.slice(0,6));
            var latitude = getCoordinate(data.slice(7,11));
            var longitude = getCoordinate(data.slice(11,15));
            var speed = parseInt(data[15],16);

            return {"imei": imeiNo , "type":protocolNumber, "time":time, "latitude":latitude , "longitude":longitude, "speed":speed};
        }
        else{
            // console.log("else");
        }
    };


    function getTime(time) {
        var year = (parseInt(time[0],16)+2000).toString();
        var month = parseInt(time[1],16).toString();
        var day = parseInt(time[2],16).toString();
        var hour = parseInt(time[3],16).toString();
        var minute = parseInt(time[4],16).toString();
        var second = parseInt(time[5],16).toString();

        return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    };

    function getCoordinate(point){
        var coordinate  = (parseInt(point.join(""),16)/1800000);
        return coordinate;
    };




};

