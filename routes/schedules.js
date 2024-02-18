var express = require('express');
var router = express.Router();
var moment = require('moment');
var _ = require('underscore')
var async = require("async");

var navcon = require('../app/utill/navcon');
var Schedule = require('../app/models/schedule');
var Socket = require('../app/utill/socket_io');

router.route('/schedule')
    .get(function (req, res) {
        Schedule.find({}, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                res.json(data);
            }
        });

    })

    .post(function (req, res) {
        async.parallel({
            organizedBy: function (callback) {
                navcon.getUserById(req.body.organizedById, function (err, customer) {
                    callback(err, customer)
                })
            },
            meetingRoom: function (callback) {
                navcon.getMeetingRoomById(req.body.meetingRoomId, function (err, customer) {
                    callback(err, customer)
                })
            }
        }, function (err, results) {
            if (err)
                navcon.errorResponse(err, res);
            else {
                save(results.organizedBy, results.meetingRoom);
            }
        });

        function save(organizedBy, meetingRoom) {
            var ip = req.connection.remoteAddress.split(':').pop();

            var schedule = new Schedule();
            schedule.subject = req.body.subject;
            schedule.date = req.body.date;
            schedule.start_time = req.body.start_time;
            schedule.end_time = req.body.end_time;
            schedule.organizedById = organizedBy._id;
            schedule.meetingRoomId = meetingRoom._id;
            schedule.isCompleted = false;
            schedule.ipAddress = ip

            schedule.save(function (err) {
                if (err) {
                    navcon.errorResponse(err, res);
                } else {
                    Socket.onScheduleModified()
                    sendNotification()
                    res.json({
                        message: 'Schedule created!'
                    });
                }
            });
        }



    })

router.route('/updateSchedule/:id')
    .post(function (req, res) {

        async.parallel({
            organizedBy: function (callback) {
                navcon.getUserById(req.body.organizedById, function (err, customer) {
                    callback(err, customer)
                })
            },
            meetingRoom: function (callback) {
                navcon.getMeetingRoomById(req.body.meetingRoomId, function (err, customer) {
                    callback(err, customer)
                })
            }
        }, function (err, results) {
            if (err)
                navcon.errorResponse(err, res);
            else {
                update(results.organizedBy, results.meetingRoom);
            }
        });

        function update(organizedBy, meetingRoom) {
            var ip = req.connection.remoteAddress.split(':').pop();
            Schedule.update({
                    "_id": req.params.id
                }, {
                    "subject": req.body.subject,
                    "date": req.body.date,
                    "start_time": req.body.start_time,
                    "end_time": req.body.end_time,
                    "organizedById": organizedBy._id,
                    "meetingRoomId": meetingRoom._id,
                    "ipAddress": ip,
                    "isCompleted":false
                },
                function (err, data) {
                    if (err)
                        navcon.errorResponse(err, res);
                    else {
                        Socket.onScheduleModified()
                        sendNotification()
                        res.json({
                            message: 'Changes are updated successfully!'
                        });
                    }
                })
        }
    })

router.route('/scheduleiPad')
    .get(function (req, res) {
        Schedule.find({
            "isCompleted": false
        }, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                var meetingArray = []
                data.forEach(function (value) {
                    checkHeaderTimePeriod(value.date, function (result) {
                        var tempMeetingObj = {
                            "_id": value._id,
                            "dateTimeStamp": value.date,
                            "isCompleted": value.isCompleted,
                            "organizedById": value.organizedById,
                            "meetingRoomId": value.meetingRoomId,
                            "endTime": value.end_time,
                            "startTime": value.start_time,
                            "date": result,
                            "title": value.subject,
                        }
                        var fromMoment = moment.unix(value.start_time)
                        var nowMoment = moment()
                        if (moment(fromMoment).isSameOrAfter(nowMoment)) {
                            meetingArray.push(tempMeetingObj)
                        }else{

                        }
                    })
                });

                var groupedData = _.groupBy(meetingArray, f => {
                    return f.date
                });

                var tempObj = []
                _.each(groupedData, function (singleGroup, key) {
                    var qwe = _.sortBy(singleGroup, function (num) {
                        return moment.unix(num.startTime)
                    });
                    var temp = {
                        date: key,
                        meetings: qwe
                    }
                    tempObj.push(temp)
                })

                res.json(tempObj);
            }
        });

    })


router.route('/updateScheduleStatus/:id')
    .post(function (req, res) {

        Schedule.update({
                "_id": req.params.id
            }, {
                "isCompleted": true
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

function checkHeaderTimePeriod(key, callback) {
    var date = moment.unix(key).format("DD/MM/YYYY");
    var isToday = moment(date).isSame(Date(), 'd')
    var returnValue = ""
    if (isToday == true) {
        returnValue = "Today"
    } else {
        returnValue = date
    }
    callback(returnValue)

}

//    - [x] Get All Schedules by Meeting Room 
router.route('/scheduleByMeetingRoom/:id')
    .post(function (req, res) {
        Schedule.find({
            "meetingRoomId": req.params.id,
            "isCompleted": false
        }, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                var meetingArray = []
                data.forEach(function (value) {
                    checkHeaderTimePeriod(value.date, function (result) {
                        console.log(result)
                        var tempMeetingObj = {
                            "_id": value._id,
                            "dateTimeStamp": value.date,
                            "isCompleted": value.isCompleted,
                            "organizedById": value.organizedById,
                            "meetingRoomId": value.meetingRoomId,
                            "endTime": value.end_time,
                            "startTime": value.start_time,
                            "date": result,
                            "title": value.subject,
                        }
                        var fromMoment = moment.unix(value.start_time)
                        var endMoment = moment.unix(value.end_time)
                        var nowMoment = moment()
                        if (moment(fromMoment).isSameOrAfter(nowMoment)) {
                            meetingArray.push(tempMeetingObj)
                        }

                        if(nowMoment.isBetween(fromMoment, endMoment)){
                            meetingArray.push(tempMeetingObj)
                        }
                    })
                });

                var groupedData = _.groupBy(meetingArray, f => {
                    return f.date
                });

                var tempObj = []
                _.each(groupedData, function (singleGroup, key) {
                    var qwe = _.sortBy(singleGroup, function (num) {
                        return moment.unix(num.startTime)
                    });
                    var temp = {
                        date: key,
                        meetings: qwe
                    }
                    tempObj.push(temp)
                })

                res.json(tempObj);
            }
        });

    })

    function sendNotification() {
        
    }


module.exports = router;