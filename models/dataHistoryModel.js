/**
 * Created by shan on 1/20/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var dataHistory = new Schema({
    imei: String,
    date:Date,
    hour:Number,
    dateTime : String,
    location : Array
});

// the schema is useless so far
// we need to create a model using it
var DataHistory = mongoose.model('DataHistory', dataHistory);

// make this available to our users in our Node applications
module.exports = DataHistory;