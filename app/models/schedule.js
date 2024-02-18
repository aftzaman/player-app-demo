var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScheduleSchema   = new Schema({
    subject: {type:String, required:true},
    date: {type:Number, required:true},
    start_time: {type:Number, required:true},
    end_time: {type:Number, required:true},
    organizedById: {type:Schema.ObjectId, required:true, ref:"User"},
    meetingRoomId: {type:Schema.ObjectId, required:true, ref:"MeetingRoom"},
    isCompleted: {type:Boolean, required:true},
    ipAddress: {type:String, required:true},
});

module.exports = mongoose.model('Schedule', ScheduleSchema);

