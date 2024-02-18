var express = require('express');
var router = express.Router();
var moment = require('moment');
var _ = require('underscore')
var async = require("async");

var navcon = require('../app/utill/navcon');
var MeetingRoom = require('../app/models/meeting_room');
var Device = require('../app/models/device');

router.route('/meetingRoom')
    .post(function (req, res) {
        var meetingRoom = new MeetingRoom();
        meetingRoom.name = req.body.label;
        meetingRoom.active = true
        meetingRoom.save(function (err) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                res.json({
                    error: false,
                    message: 'Room Registerd Successfully'
                });
            }
        });

    })

    .get(function (req, res) {

        MeetingRoom.find({}, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                var meetingRooms = []
                if (data.length > 0) {
                    _.each(data, function (singleRoom, index) {
                        temp = {
                            "key": singleRoom._id,
                            "label": singleRoom.name
                        }
                        meetingRooms.push(temp)
                    })
                }

                temp = {
                    "key": "",
                    "label": "Select Meeting Room",
                }
                meetingRooms.unshift(temp)
                res.json(meetingRooms);
            }
        });

    })

router.route('/updateMeetingRoom/:id')
    .post(function (req, res) {
        MeetingRoom.update({
                "_id": req.params.id
            }, {
                "name": req.body.label
            },
            function (err, data) {
                if (err)
                    navcon.errorResponse(err, res);
                else {
                    res.json({
                        message: 'Changes are updated successfully!'
                    });
                }
            })
    })

router.route('/removeMeetingRoom/:id')
    .post(function (req, res) {
        MeetingRoom.remove({
                "_id": req.params.id
            },
            function (err, data) {
                if (err)
                    navcon.errorResponse(err, res);
                else {
                    res.json({
                        message: 'Removed successfully!'
                    });
                }
            })
    })

router.route('/checkDeviceById/:id')
    .post(function (req, res) {


        async.parallel({
            device: function (callback) {
                Device.find({
                        deviceId: req.params.id
                    },
                    function (err, data) {
                        if (err) {
                            callback(err, null)
                        } else {
                            callback(null, data)
                        }
                    })
            },
        }, function (err, results) {
            if (err)
                navcon.errorResponse(err, res);
            else {
                if (results.device.length > 0) {
                    MeetingRoom.find({
                        "deviceId": results.device[0]._id
                    }, function (err, data) {
                        if (err) {
                            navcon.errorResponse(err, res);
                        } else {
                            res.json(data);
                        }
                    });
                } else {
                    res.json({
                        message: 'Not found'
                    });
                }

            }
        });

    })

router.route('/assignDeviceToMeetingRoom')
    .post(function (req, res) {

        function getDevice(deviceId, callback) {
            navcon.getDeviceByID(req.body.deviceId, function (err, device) {
                if (err && err !== null && err.message === undefined)
                    navcon.errorResponse(err, res);

                if (err !== undefined && err !== null && err.message !== null && err.message !== undefined && err.message === "Invalid device Id") {
                    device = new Device();
                    device.deviceType = req.body.deviceType;
                    device.deviceId = req.body.deviceId;
                    device.notificationId = req.body.notificationId;
                    device.model = req.body.model;
                    device.active = true;
                    device.save(function (err) {
                        callback(err, device);
                    });
                } else {
                    device.update({
                        $set: {
                            "active": true,
                            "notificationid": req.body.notificationId
                        }
                    }, function (err) {
                        callback(err, device);
                    });
                }
            })
        }

        async.parallel({
            device: function (callback) {
                getDevice(req.body.deviceId, function (err, device) {
                    callback(err, device)
                })
            },
        }, function (err, results) {
            if (err)
                navcon.errorResponse(err, res);
            else {
                updateMeetingRoom(results.device);
            }
        });

        function updateMeetingRoom(device) {
            MeetingRoom.update({
                    "_id": req.body.meetingRoomId
                }, {
                    "deviceId": device._id
                },
                function (err, data) {
                    if (err)
                        navcon.errorResponse(err, res);
                    else {
                        res.json({
                            message: 'Changes are updated successfully!'
                        });
                    }
                })
        }



    })


module.exports = router;