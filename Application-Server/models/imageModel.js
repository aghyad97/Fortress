var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
  userId: {type: ObjectId, required: true},
  image: {type: String, required: true},
  isPredict: {type: Boolean, required: false},
}, {timestamps: true});


imageSchema
	.virtual("imageSchema")
	.get(function () {
		return this.image;
	});

module.exports = mongoose.model("imageSchema", imageSchema);