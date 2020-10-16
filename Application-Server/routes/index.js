var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	res.render("index", { 
		title: "Fortress" ,
		user: req.user
	});
});

router.get("/about", function(req, res) {
	res.render("layouts/about", { 
		title: "Fortress" ,
		user: req.user
	});
});

router.get("/login", function(req, res) {
	res.render("layouts/login", {
    title: "Login to Fortress"
  });
});

router.get("/register", function(req, res) {
	res.render("layouts/register", {
    title: "Register with Fortress"
  });
});


module.exports = router;