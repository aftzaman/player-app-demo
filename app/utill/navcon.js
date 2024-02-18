var navcon = function() {};
var moment = require("moment");
var async = require("async");
var Device = require("../../app/models/device");
var User = require("../../app/models/user");
var MeetingRoom = require("../../app/models/meeting_room");

navcon.prototype.errorResponse = function(err, res) {
  var obj = {};
  obj.type = "error";
  obj.response = err;
  res.send(obj);
};

navcon.prototype.getDeviceByID = function(id, callback) {
  var device = Device.find({ deviceId: id }, function(err, data) {
    if (err) callback(err, null);

    if (data === undefined || data.length === 0)
      callback({ message: "Invalid device Id" }, null);
    else callback(null, data[0]);
  });
};

navcon.prototype.getUserById = function(id, callback) {
  var user = User.find({ _id: id }, function(err, data) {
    if (err) callback(err, null);

    if (data === undefined || data.length === 0)
      callback({ message: "Invalid User Id" }, null);
    else callback(null, data[0]);
  });
};

navcon.prototype.getMeetingRoomById = function(id, callback) {
  var meetingRoom = MeetingRoom.find({ _id: id }, function(err, data) {
    if (err) callback(err, null);

    if (data === undefined || data.length === 0)
      callback({ message: "Invalid Meeting Room Id" }, null);
    else callback(null, data[0]);
  });
};

module.exports = new navcon();
