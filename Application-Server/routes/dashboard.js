const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");

router.get("/dashboard", function (req, res) {
	try {
		
		console.log(req.headers.authorization);
		jwt.verify(req.cookies.userToken, process.env.JWT_SECRET);

		return res.render('layouts/dashboard', {
			authorized: true,
			name: req.cookies.fullName,
			title: "Dashboard - Fortress",
		});
	} catch (error) {
		console.log('invalid token found ' + req.headers.authorization);
		return apiResponse.unauthorizedResponse(res, 'Invalid token.');
	}
});

module.exports = router;