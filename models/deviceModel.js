/**
 * Created by shan on 1/20/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var deviceSchema = new Schema({
    imei: { type: String, unique: true },
    tag: String,
    isActive: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Device = mongoose.model('Device', deviceSchema);

// make this available to our users in our Node applications
module.exports = Device;