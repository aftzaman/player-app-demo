// console.log(mqtt)

// // const protocol = 'mqtt'
// // const host = 'broker.emqx.io'
// // const port = '1883'
// // const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

// // const connectUrl = `${protocol}://${host}:${port}`

// // const client = mqtt.connect(connectUrl, {
// //     clientId,
// //     clean: true,
// //     connectTimeout: 4000,
// //     username: '',
// //     password: '',
// //     reconnectPeriod: 1000,
// //   })

// // client.on('connect', function () {
// //   console.log('Connected')
// //   // Subscribe to a topic
// // //   client.subscribe('test', function (err) {
// // //     if (!err) {
// // //       // Publish a message to a topic
// // //       client.publish('test', 'Hello mqtt')
// // //     }
// // //   })
// // })

// // const url = 'ws://broker.emqx.io:8083/mqtt'
// const url = 'mqtt://127.0.0.1:1883'
// /***
//     * Node.js
//     * This document explains how to use MQTT over TCP with both mqtt and mqtts protocols.
//     * EMQX's default port for mqtt connections is 1883, while for mqtts it is 8883.
//     */
// // const url = 'mqtt://broker.emqx.io:1883'

// // Create an MQTT client instance
// const options = {
//   // Clean session
//   clean: true,
//   connectTimeout: 4000,
// //   // Authentication
// //   clientId: 'emqx_test',
// //   username: 'emqx_test',
// //   password: 'emqx_test',
// }
// const client  = mqtt.connect(url, options)
// client.on('connect', function () {
//   console.log('Connected')
//   // Subscribe to a topic
//   client.subscribe('test', function (err) {
//     if (!err) {
//       // Publish a message to a topic
//       client.publish('test', 'Hello mqtt')
//     }
//   })
// })

// // Receive messages
// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   client.end()
// })