var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require("mongoose-relationship");

var DeviceSchema = new Schema({
    deviceType: {type:String, required: true},
    model: String,
    deviceId: {type:String, required: true, unique: true},
    notificationId: String,
    active: {type:Boolean, required: true}
});

module.exports = mongoose.model('Device', DeviceSchema);