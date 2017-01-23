/**
 * Created by shan on 1/20/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var deviceSchema = new Schema({
    imei: { type: String, unique: true },
    tag: String,
    active: Boolean,
    registeredDate: Date,
    lastEditDate : Date,
    deactivatedDate: Date ,
    reactivatedDate: Date,
    lastLocation : {
        latitude:null,
        longitude: null,
        dateTime:null,
        speed : null,
        direction: null
    },
    status : {
        dateTime: null
    }


});

// the schema is useless so far
// we need to create a model using it
var Device = mongoose.model('Device', deviceSchema);

// make this available to our users in our Node applications
module.exports = Device;