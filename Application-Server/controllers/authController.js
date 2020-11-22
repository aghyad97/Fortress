const UserModel = require("../models/UserModel");
const {
	body,
	validationResult
} = require("express-validator");
const {
	sanitizeBody
} = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
// const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const {
	constants
} = require("../helpers/constants");
const mongoose = require("mongoose");
// const UserModel = mongoose.model("User");
exports.register = [
	// Validate fields.
	body("fullName").isLength({
		min: 1
	}).trim().withMessage("Full Name must be specified.")
	.withMessage("Full Name has no alpha "),
	body("email").isLength({
		min: 1
	}).trim().withMessage("Email must be specified.")
	.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
		return UserModel.findOne({
			email: value
		}).then((user) => {
			if (user) {
				return Promise.reject("E-mail already in use");
			}
		});
	}),
	body("password").isLength({
		min: 6
	}).trim().withMessage("Password must be 6 characters or longer."),
	// Sanitize fields.
	sanitizeBody("fullName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				//hash input password
				bcrypt.hash(req.body.password, 10, function (err, hash) {
					// generate OTP for confirmation
					// let otp = utility.randomNumber(4);
					// Create User object with escaped and trimmed data
					var user = new UserModel({
						fullName: req.body.fullName,
						email: req.body.email,
						password: hash,
						isConfirmed: true,
					});
					// Html email body
					// let html = "<p>Please Confirm your Account.</p><p>OTP: "+otp+"</p>";
					// Send confirmation email
					// mailer.send(
					// 	constants.confirmEmails.from, 
					// 	req.body.email,
					// 	"Confirm Account",
					// 	html
					// ).then(function(){
					// Save user.
					user.save(function (err) {
						if (err) {
							return apiResponse.ErrorResponse(res, err);
						}
						let userData = {
							_id: user._id,
							fullName: user.fullName,
							email: user.email
						};
						return apiResponse.successResponseWithData(res, "Registration Success.", userData);
					});
					// }).catch(err => {
					// 	console.log(err);
					// 	return apiResponse.ErrorResponse(res,err);
					// }) ;
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.login = [
	body("email").isLength({
		min: 1
	}).trim().withMessage("Email cannot be empty")
	.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({
		min: 1
	}).trim().withMessage("Password cannot be empty"),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				UserModel.findOne({
					email: req.body.email
				}).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password, user.password, function (err, same) {
							if (same) {
								//Check account confirmation.
								if (user.isConfirmed) {
									// Check User's account active or not.
									if (user.status) {
										let userData = {
											_id: user._id,
											firstName: user.firstName,
											lastName: user.lastName,
											email: user.email,
										};
										//Prepare JWT token for authentication
										const jwtPayload = userData;
										const jwtData = {
											expiresIn: process.env.JWT_TIMEOUT_DURATION,
										};
										const secret = process.env.JWT_SECRET;
										//Generated JWT token with Payload and secret.
										userData.token = jwt.sign(jwtPayload, secret, jwtData);
										return apiResponse.successResponseWithData(res, "Login Success.", userData);
									} else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact us");
									}
								} else {
									return apiResponse.unauthorizedResponse(res, "Please confirm your account.");
								}
							} else {
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					} else {
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.verifyConfirm = [
	body("email").isLength({
		min: 1
	}).trim().withMessage("Email cannot be empty")
	.isEmail().withMessage("Email must be a valid email address."),
	body("otp").isLength({
		min: 1
	}).trim().withMessage("OTP field is empty"),
	sanitizeBody("email").escape(),
	sanitizeBody("otp").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				var query = {
					email: req.body.email
				};
				UserModel.findOne(query).then(user => {
					if (user) {
						//Check already confirm or not.
						if (!user.isConfirmed) {
							//Check account confirmation.
							if (user.confirmOTP == req.body.otp) {
								//Update user as confirmed
								UserModel.findOneAndUpdate(query, {
									isConfirmed: 1,
									confirmOTP: null
								}).catch(err => {
									return apiResponse.ErrorResponse(res, err);
								});
								return apiResponse.successResponse(res, "Account confirmed successfully.");
							} else {
								return apiResponse.unauthorizedResponse(res, "Otp is wrong");
							}
						} else {
							return apiResponse.unauthorizedResponse(res, "Account is already confirmed.");
						}
					} else {
						return apiResponse.unauthorizedResponse(res, "Specified email not found.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.resendConfirmOtp = [
	body("email").isLength({
		min: 1
	}).trim().withMessage("Email must be specified.")
	.isEmail().withMessage("Email must be a valid email address."),
	sanitizeBody("email").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				var query = {
					email: req.body.email
				};
				UserModel.findOne(query).then(user => {
					if (user) {
						//Check already confirm or not.
						if (!user.isConfirmed) {
							// Generate otp
							let otp = utility.randomNumber(4);
							// Html email body
							let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
							// Send confirmation email
							mailer.send(
								constants.confirmEmails.from,
								req.body.email,
								"Confirm Account",
								html
							).then(function () {
								user.isConfirmed = 0;
								user.confirmOTP = otp;
								// Save user.
								user.save(function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}
									return apiResponse.successResponse(res, "Confirm otp sent.");
								});
							});
						} else {
							return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
						}
					} else {
						return apiResponse.unauthorizedResponse(res, "Specified email not found.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];