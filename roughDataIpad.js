// - [x] Register Device with meetingId
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
            console.log(device)
            console.log(req.body)
            MeetingRoom.update({
                    "_id": req.body.meetingRoomId
                }, {
                    "deviceId": device._id
                },
                function (err, data) {
                    if (err)
                        navcon.errorResponse(err, res);
                    else {
                        console.log(data)
                        res.json({
                            message: 'Changes are updated successfully!'
                        });
                    }
                })
        }



    })


//    - [x] Get All Schedules by Meeting Room 
router.route('/scheduleByMeetingRoom/:id')
    .post(function (req, res) {
        Schedule.find({
            "meetingRoomId": req.params.id
        }, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                res.json(data);
            }
        });

    })

// - [x] Update completed status by schedule id
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
                    console.log(data)
                    res.json({
                        message: 'Changes are updated successfully!'
                    });
                }
            })
    })