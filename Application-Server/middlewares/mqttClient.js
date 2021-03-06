const mqtt = require("mqtt");
const sensorModel = require("../models/sensorModel");
const imageModel = require("../models/imageModel");
const http = require('http');
var mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883');
var isEnabled = true;
var nodeRedHostname = 'localhost';
var nodeRedPort = 1880;
var httpRequestOptions = {
    host: nodeRedHostname,
    port: nodeRedPort,
    path: '/sendemail'
}

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
        // do stuff with the accJSON
        if (!sensorInfo.accelerometer)
            return; // makes sure the accelerometer is a JSON with proper format
        if (sensorInfo.isPredict && isEnabled) {
            console.log('found person from sensors!')
            // Publishes message to be read by the main app so it can display notification
            mqttClient.publish('project/foundperson', Date.now().toString());
            // Sends a request to node-red to send an email to the user, warning them that a person was found
            httpRequestOptions.path = '/sendemail?email=' + sensorInfo.email;
            http.request(httpRequestOptions).end();
        }
        const sensorDocument = new sensorModel({
            x: sensorInfo.accelerometer.value[0],
            y: sensorInfo.accelerometer.value[1],
            z: sensorInfo.accelerometer.value[2],
            proximity: sensorInfo.proximity,
            isPredict: sensorInfo.isPredict,
            email: sensorInfo.email,
        })
        sensorDocument.save(function (err, sensorDocument) {
            if (err) return console.error(err);
            console.log('sensor success');
          }); 
    }
    else if (topic == 'project/images') {
        var imageInfo = JSON.parse(message.toString());
        if (imageInfo.isPredict && isEnabled) {
            // Publishes message to be read by the main app so it can display notification
            mqttClient.publish('project/foundperson', Date.now().toString());
            httpRequestOptions.path = '/sendemail?email=' + imageInfo.email;
            http.request(httpRequestOptions).end();
        }
        const imageDocument = new imageModel(imageInfo);
        imageDocument.save(function (err, imageDocument) {
            if (err) return console.error(err);
            console.log('image success');
          });        
    }
})

module.exports = {
    mqttClient: mqttClient,
    setEnabled: (enabled) => {
        isEnabled = enabled;
    },
};