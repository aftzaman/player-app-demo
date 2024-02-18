var express = require('express');
var router = express.Router();
var moment = require('moment');
var _ = require('underscore')

var navcon = require('../app/utill/navcon');
var User = require('../app/models/user');


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

    .get(function (req, res) {
        User.find({}, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                var user = []
                if (data.length > 0) {
                    _.each(data, function (singleUser) {
                        temp = {
                            "key": singleUser._id,
                            "label": singleUser.name,
                            "email": singleUser.email
                        }
                        user.push(temp)
                    })
                }

                temp = {
                    "key": "",
                    "label": "Select User"
                }
                user.unshift(temp)

                res.json(user);
            }
        });

    });

router.route('/updateUser/:id')
    .post(function (req, res) {
        User.update({
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

router.route('/removeUser/:id')
    .post(function (req, res) {
        User.remove({
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


module.exports = router;