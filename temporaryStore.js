/**
 * Created by shan on 1/17/17.
 */
module.exports.temporaryStore = function() {

    this.store = function (data, client) {
        addToRedis(data,client);
    };

    function addToRedis(data, client) {
        var timeNow = new Date();
        var year = timeNow.getYear();
        var month = timeNow.getMonth()+1;
        var date = timeNow.getDate();
        var hour = timeNow.getHours();
        var minute = timeNow.getMinutes();
        var second = timeNow.getSeconds();
        var dateTime = year+month+date+hour+minute+second
        var key = data.imei+":"+data.type+":"+dateTime;
        client.set(key, JSON.stringify(data));
    }



};