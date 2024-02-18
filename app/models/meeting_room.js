var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MeetingRoomSchema = new Schema({
    name: {type:String, unique:true,required: true},
    deviceId: {type:Schema.ObjectId, ref:"Device"},
    active: {type:Boolean, required: true}
});

module.exports = mongoose.model('MeetingRoom', MeetingRoomSchema);