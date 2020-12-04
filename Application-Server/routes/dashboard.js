var express = require("express");
var router = express.Router();

router.get("/dashboard", function(req, res) {
	try {
		jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
		res.render("dashboard", { 
			user: req.headers.user
		});
} catch (error) {
		console.log('invalid token found ' + req.headers.authorization);
		return apiResponse.unauthorizedResponse(res, 'Invalid token.');
}
});

router.post("/dashboard", function(req, res) {
	
	try {
		jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
		res.render("dashboard", { 
			user: req.headers.user
		});
} catch (error) {
		console.log('invalid token found ' + req.headers.authorization);
		return apiResponse.unauthorizedResponse(res, 'Invalid token.');
}
});

module.exports = router;