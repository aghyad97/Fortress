const express = require("express");
const path = require("path");
const compression = require('compression')

const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const indexRouter = require("./routes/index");
const dashboardRouter = require("./routes/dashboard");

const apiRouter = require("./routes/api");
const apiResponse = require("./helpers/apiResponse");
const cors = require("cors");
const authRouter = require("./routes/auth");

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL);
const mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	}).then(() => {
		//don't show the log when it is test
		if (process.env.NODE_ENV !== "test") {
			console.log("Connected to %s", MONGODB_URL);
			console.log("App is running ... \n");
			console.log("Press CTRL + C to stop the process. \n");
		}
	})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({
	extended: false,
	limit: '1mb'
}));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);
app.use("/", authRouter);
app.use("/", dashboardRouter);
// throw 404 if URL not found
app.all("*", function (req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});
// var port = process.env.PORT || serverPort;

// app.listen(3000);

module.exports = app;