var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
//   userId: {type: mongoose.ObjectId, required: true},
  image: {type: String, required: true},
  isPredict: {type: Boolean, required: false},
  email: {type: String, required: false},
}, {timestamps: true});


imageSchema
	.virtual("imageSchema")
	.get(function () {
		return this.image;
	});

module.exports = mongoose.model("imageSchema", imageSchema);
