var mongoose = require("mongoose");

var sensorSchema = new mongoose.Schema({
//   userId: {type: mongoose.ObjectId, required: true},
	x: {type: String, required: true},
	y: {type: String, required: true},
	z: {type: String, required: true},
  proximity: {type: String, required: true},
  isPredict: {type: Boolean, required: false},
}, {timestamps: true});


sensorSchema
	.virtual("sensorSchema")
	.get(function () {
		return this.userId;
	});

module.exports = mongoose.model("sensorSchema", sensorSchema);
