var express = require('express');
var router = express.Router();
var _ = require('underscore')

var navcon = require('../app/utill/navcon');
var Device = require('../app/models/device');


router.route('/devices')
    .get(function (req, res) {
        Device.find({}, function (err, data) {
            if (err) {
                navcon.errorResponse(err, res);
            } else {
                res.json(data);
            }
        });

    });


module.exports = router;