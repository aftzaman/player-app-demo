var Notification = function() {};

/* Apple notification */
var apn = require('apn');

var apnProvider = new apn.Provider({
    token: {
        key: './app/utill/key.p8', // Path to the key p8 file
        keyId: 'Z8B697V565', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
        teamId: 'GMB89XL7D5', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
    },
    production: false // Set to true if sending a notification to a production iOS app
});


function iosSend(apnTokens, message, title, callback) {
    // Prepare a new notification
    var apnNotification = new apn.Notification();

    // Specify your iOS app's Bundle ID (accessible within the project editor)
    apnNotification.topic = 'com.navcon.nmr';

    apnNotification.contentAvailable = 1;

    // Set expiration to 1 hour from now (in case device is offline)
    apnNotification.expiry = Math.floor(Date.now() / 1000) + 3600;

    // Set app badge indicator
    apnNotification.badge = 1;

    // Play ping.aiff sound when the notification is received
    apnNotification.sound = 'default';

    apnNotification.body = message;
    apnNotification.title = title;
    apnProvider.send(apnNotification, apnTokens).then(function(result) {
        callback(null, JSON.stringify(result));
    });
};


/* Apple notification */

/* Google notification */
var gcm = require('node-gcm');
var gcmSender = new gcm.Sender("AIzaSyApPnHvuNP1quTtqm8pXH-j2KqJTHwFyTI");

function androidSend(gemTokens, message, title, callback) {
    var gemMessage = new gcm.Message({
        data: { message: message },
        notification: {
            title: title
        },
        priority: 'high'
    });
    gcmSender.send(gemMessage, { registrationTokens: gemTokens }, function(err, response) {
        callback(err, response);
    });
}

/* Google notification */

Notification.prototype.send = function(deviceList, message, title, deviceid, callback) {
    var androidTokens = [];
    var iosTokens = [];
    deviceList.forEach(function(item) {
        item.devices.forEach(function(device) {
            if ((deviceid === undefined || deviceid === "") || (deviceid !== undefined && deviceid !== device.deviceid)) {
                if (device.devicetype !== undefined && device.devicetype.toLowerCase() === "ios") {
                    if (device.notificationid !== undefined)
                        iosTokens.push(device.notificationid);
                } else if (device.devicetype !== undefined && device.devicetype.toLowerCase() === "android") {
                    if (device.notificationid !== undefined)
                        androidTokens.push(device.notificationid);
                }
            }
        })
    })

    //remove duplicates
    androidTokens = Array.from(new Set(androidTokens));

    iosTokens = Array.from(new Set(iosTokens));
    //for android
    if (androidTokens.length > 0) {
        androidSend(androidTokens, message, title, function(err, result) {
            if (err)
                console.log("notificationError:" + err);
        })
    }

    //for ios
    if (iosTokens.length > 0) {

        iosSend(iosTokens, message, title, function(err, result) {
            if (err)
                console.log("notificationError:" + result);
            //console.log("notificationsend:" + message);
        })
    }

};

module.exports = new Notification();