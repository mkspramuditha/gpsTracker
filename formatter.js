/**
 * Created by shan on 1/16/17.
 */
module.exports.formatter = function(){

    this.format = function (message, imeiNo) {
        // console.log(message);
        var dataArray = message.toString('hex').match(/.{1,2}/g);
        if(dataArray.length <=10){
            // console.log("length");
            //TODO add notification functionality( email ) if there is any error
            return false;

        }
        var startbit = dataArray[0]+dataArray[1];
        var packetLength = dataArray[2];
        var protocolNumber = dataArray[3];
        var data = dataArray.slice(4,parseInt(packetLength, 16)-1);
        var length = dataArray.length;

        var serialNumber = dataArray[length-6]+dataArray[length-5];
        var errorCheck = dataArray[length-4]+dataArray[length-3];
        var stopBit = dataArray[length-2] + dataArray[length-1];


        if(startbit !="7878" || stopBit != "0d0a"){
            console.log("startbit or endbit wrong");
            return false;

        }

        if(protocolNumber == "01"){
            var imei = data.join("");
            //TODO add response ( serial number error check etc ..)
            return {"type":protocolNumber,"imei":imei};
        }
        else if(protocolNumber == "12"){
            var time = getTime(data.slice(0,6));
            var latitude = getCoordinate(data.slice(7,11));
            var longitude = getCoordinate(data.slice(11,15));
            var speed = parseInt(data[15],16);
            var courseStatus = getCourseStatus(data.slice(16,18));

            return {"imei": imeiNo , "type":protocolNumber, "time":time, "latitude":latitude , "longitude":longitude, "speed":speed,"course":courseStatus};
        }
        else if(protocolNumber == "13"){

            //TODO this is required(need to respond for this)
            var info = getInformation(data[0]);
            var voltage = voltageLevel(data[1]);
            var gsm = gsmStrength(data[2]);

            return {"imei":imeiNo, "type":protocolNumber, "info": info, "voltageLevel":voltage, "gsm":gsm};
        }
        else if(protocolNumber == "15"){

        }
        else if(protocolNumber == "16"){
            var time = getTime(data.slice(0,6));
            var latitude = getCoordinate(data.slice(7,11));
            var longitude = getCoordinate(data.slice(11,15));
            var speed = parseInt(data[15],16);
            var courseStatus = getCourseStatus(data.slice(16,18));
            var info = getInformation(data[27]);
            var voltage = voltageLevel(data[28]);
            var gsm = gsmStrength(data[29]);

            return {"imei": imeiNo , "type":protocolNumber, "time":time, "latitude":latitude , "longitude":longitude, "speed":speed , "info":info, "voltageLevel":voltage,"gsm":gsm,"course": courseStatus};

        }
        else if(protocolNumber == "1a"){

        }
        else if(protocolNumber =="80"){

        }

        //not a valid protocol number
        //TODO add notification functionality if there is any error
        return false;
    };


    function getTime(time) {
        var year = (parseInt(time[0],16)+2000).toString();
        var month = parseInt(time[1],16).toString();
        var day = parseInt(time[2],16).toString();
        var hour = parseInt(time[3],16).toString();
        var minute = parseInt(time[4],16).toString();
        var second = parseInt(time[5],16).toString();

        return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    }

    function getCoordinate(point){
        var coordinate  = (parseInt(point.join(""),16)/1800000);
        return coordinate;
    }

    function getInformation(information) {
        var info = parseInt(information , 16).toString(2);
        var infoObj = {};
        if(info[0] == '1'){
            infoObj.active = true;
        }
        else{
            infoObj.active = false;
        }

        if(info[1] == '1'){
            infoObj.acc = 'HIGH';
        }
        else {
            infoObj.acc = 'LOW';
        }

        if(info[2] == '2'){
            infoObj.charge = true;
        }
        else {
            infoObj.charge = false;
        }

        var alarm = info.slice(3,6);

        if(alarm == '100'){
            infoObj.alarm = 'SOS';
        }
        else if(alarm == '011'){
            infoObj.alarm = 'LOW_BATTERY';
        }
        else if(alarm == '010'){
            infoObj.alarm = 'POWER_CUT';
        }
        else if(alarm == '001'){
            infoObj.alarm = 'SHOCK_ALARM';
        }
        else if(alarm == '000'){
            infoObj.alarm = 'NORMAL';
        }

        if(info[6] == '1'){
            infoObj.tracking = true;
        }
        else{
            infoObj.tracking = false;
        }

        if(info[7] == '1'){
            infoObj.oilElectricity = true;
        }
        else{
            infoObj.oilElectricity = false;
        }


        return infoObj;
    }

    function voltageLevel(voltage) {
        var voltageMsg = parseInt(voltage, 16);

        if(voltageMsg == 0){
            return "NO_POWER";
        }
        else if(voltageMsg == 1){
            return "EXTREMELY_LOW_BATTERY";
        }
        else if(voltageMsg == 2){
            return "VERY_LOW_BATTERY";
        }
        else if(voltageMsg == 3){
            return "LOW_BATTERY";
        }
        else if(voltageMsg == 4){
            return "MEDIUM";
        }
        else if(voltageMsg == 5){
            return "HIGH";
        }
        else if(voltageMsg == 6){
            return "VERY_HIGH";
        }

    }
    
    function gsmStrength(gsm) {
        if(gsm == "00"){
            return "NO_SIGNAL";
        }
        else if(gsm == "01"){
            return "EXTREMELY_WEAK_SIGNAL";
        }
        else if(gsm == "02"){
            return "VERY_WEAK_SIGNAL";
        }
        else if(gsm == "03"){
            return "GOOD_SIGNAL";
        }
        else if(gsm == "04"){
            return "STRONG_SIGNAL";
        }
    }

    function getCourseStatus(course) {
        var courseStatus = {};
        var bitStream = padDigits(parseInt(course[0],16).toString(2),8)+padDigits(parseInt(course[1],16).toString(2),8);
        console.log(bitStream);
        var course = parseInt(bitStream.slice(6,16),2);
        console.log(course);
        if(bitStream[2]=='0'){
            courseStatus.gps = 'REAL_TIME';
        }
        else{
            courseStatus.gps = 'DIFFERENTIAL_POSITIONING';
        }
        if(bitStream[3]=='0'){
            courseStatus.position = 0;
        }
        else{
            courseStatus.position = 1;
        }

        if(bitStream[4] == 0){
            courseStatus.longitude = 'EAST';
        }
        else {
            courseStatus.longitude = 'WEST';
        }

        if(bitStream[5] == 0){
            courseStatus.latitude = 'SOUTH';
        }
        else {
            courseStatus.latitude = 'NORTH';
        }

        courseStatus.course = course;

        return courseStatus;
    }

    function padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }





};

