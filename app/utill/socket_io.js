var socket = function () {};
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000);

socket.prototype.onScheduleModified = function (err, res) {
    io.emit('MODIFIED', true);
};

var isPlayer1Connected = false;
var isPlayer2Connected = false;

io.on('connection', (socket) => {
    console.log(socket.id)
    console.log("connected")
});

module.exports = new socket();