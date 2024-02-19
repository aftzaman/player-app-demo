var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({
    limit: '50mb'
}));

var port = process.env.PORT || 8085;

var router = express.Router();
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var socket = require('./app/utill/socket_io');

const server = app.listen(port, () => {
    console.log('listening on *: ' + port);
});

console.log('Magic happens on port ' + port);
