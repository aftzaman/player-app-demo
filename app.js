'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = 'views/index.html';

const app = express()
  .use(express.static(__dirname + '/views'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(app);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  });

  socket.on("playerconnect", (arg, callback) => {
      console.log(arg);
  });

});



setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

