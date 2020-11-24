var mqtt = require("mqtt")

var mqttClient = mqtt.connect('ws://localhost:9001');
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
})

mqttClient.on('message', function (topic, message) {
    if (topic == 'project/sensors') {
		// make sure the topic is correct
        var accJSON = JSON.parse(message.toString());
        // do stuff with the accJSON
    }
})

module.exports = mqttClient;