const UserModel = require("../models/UserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("./apiResponse");
const utility = require("./utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("./mailer");
const { constants } = require("./constants");



exports.register = [];

exports.login = [];

exports.verifyConfirm = [];

exports.resendConfirmOtp = [];