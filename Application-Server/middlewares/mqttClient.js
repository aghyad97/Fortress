const mqtt = require("mqtt");
const sensorModel = require("../models/sensorModel");
const imageModel = require("../models/imageModel");

var mqttClient = mqtt.connect('ws://localhost:9001');
var xPrev, yPrev, zPrev;
var isEnabled = true;
mqttClient.on('connect', function () {
    // subscribing to topic to get the coordinates
    // Subscribes with QoS 0 (0 is default)
    mqttClient.subscribe('project/sensors', function (err) {
        if (!err) {
            console.log('Subscribed to coordinates topic');
        }
        else {
            console.log(err);
        }
    });
    mqttClient.subscribe('project/images', function (err) {
        if (!err) {
            console.log('Subscribed to images topic');
        }
        else {
            console.log(err);
        }
    });
})

mqttClient.on('message', function (topic, message) {
    if (topic == 'project/sensors') {
		// make sure the topic is correct
        var sensorInfo = JSON.parse(message.toString());
        // do stuff with the accJSO
        const sensorDocument = new sensorModel({
            x: xAcceleration,
            y: yAcceleration,
            z: zAcceleration,
            proximity: proximity,
            isPredict: isPredict,
        })
        sensorDocument.save(function (err, sensorDocument) {
            if (err) return console.error(err);
            console.log('success');
          }); 
    }
    else if (topic == 'project/images') {
        var imageInfo = JSON.parse(message.toString());
        if (imageInfo.isPredict && isEnabled) {
            // TODO: Send push notification to phone when found prediction
            //       to warn the user that someone was found
            //       and maybe publish the image????
            // TODO: set isEnabled to false when user disables security system 
            console.log('found person!')
            // Publishes message to be read by the main app so it can display notification
            mqttClient.publish('project/foundperson', Date.now().toString());
        }
        const imageDocument = new imageModel(imageInfo);
        imageDocument.save(function (err, imageDocument) {
            if (err) return console.error(err);
            console.log('success');
          });        
    }
})

module.exports = mqttClient;