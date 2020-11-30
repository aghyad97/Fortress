var mongoose = require("mongoose");

var sensorSchema = new mongoose.Schema({
//   userId: {type: mongoose.ObjectId, required: true},
	x: {type: Number, required: true},
	y: {type: Number, required: true},
	z: {type: Number, required: true},
  proximity: {type: Number, required: true},
  isPredict: {type: Boolean, required: false},
}, {timestamps: true});


sensorSchema
	.virtual("sensorSchema")
	.get(function () {
		return this.userId;
	});

module.exports = mongoose.model("sensorSchema", sensorSchema);
