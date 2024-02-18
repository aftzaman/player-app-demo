//      - [x] Get All Schedules 
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
//     - [x] Get All Users
router.route('/user')
    .post(function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.active = true
        user.updatedate = moment(moment().format()).format("YYYY-MM-DD HH:mm")

        user.save(function (err) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                res.json({
                    message: 'Registerd User Successfully'
                });
            }
        });
    })

// - [x] Get All Meeting Rooms
router.route('/meetingRoom')
    .post(function (req, res) {
        var meetingRoom = new MeetingRoom();
        meetingRoom.name = req.body.name;
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

// - [x] Create New Schedules
router.route('/schedule')
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
                    res.json({
                        message: 'Schedule created!'
                    });
                }
            });
        }



    })

// - [x] Update Schedules
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
                    "ipAddress": ip
                },
                function (err, data) {
                    if (err)
                        navcon.errorResponse(err, res);
                    else {
                        Socket.onScheduleModified()
                        res.json({
                            message: 'Changes are updated successfully!'
                        });
                    }
                })
        }
    })