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
socket.onScheduleModified(function(){
    console.log('onScheduleModified on *: ' + port);
})


const server = app.listen(port, () => {
    console.log('listening on *: ' + port);
});

console.log('Magic happens on port ' + port);


// const mqtt = require('mqtt')
// const protocol = 'mqtt'
// const host = '127.0.0.1'
// const port2 = '1883'
// const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

// const connectUrl = `${protocol}://${host}:${port2}`


// const client = mqtt.connect(connectUrl, {
//     clientId,
//     clean: true,
//     connectTimeout: 4000,
//     username: 'emqx',
//     password: 'public',
//     reconnectPeriod: 1000,
//   })
  
// const topic = 'test'

// client.on('connect', () => {
//       client.subscribe([topic], () => {
//     console.log(`Subscribe to topic '${topic}'`)
//   })
   
//   })
  
// client.on('message', (topic, payload) => {
//     console.log('Received Message:', topic, payload.toString())
//   })