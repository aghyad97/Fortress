var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	fullName: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	isConfirmed: {type: Boolean, required: true, default: 0},
	confirmOTP: {type: String, required:false},
	otpTries: {type: Number, required:false, default: 0},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


UserSchema
	.virtual("fullName")
	.get(function () {
		return this.fullName;
	});

module.exports = mongoose.model("User", UserSchema);
