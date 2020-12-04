const express = require("express");
const apiResponse = require("../helpers/apiResponse");
const imageModel = require("../models/imageModel");
const jwt = require("jsonwebtoken");
const mqttClient = require("../middlewares/mqttClient.js");
// const userModel = require("../models/userModel");

var router = express.Router();

router.post('/togglesystem', function(req, res) {
    // Would basically enable/disable the system 
    try {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    } catch (error) {
        console.log('invalid token found ' + req.headers.authorization);
        return apiResponse.unauthorizedResponse(res, 'Invalid token.');
    }
    try {
        // enable/disable here
        mqttClient.setEnabled(req.body.toggle);
        return apiResponse.successResponse(res, 'Toggle Success');
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

router.get('/getimages', function(req, res) {
    try {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    } catch (error) {
        console.log('invalid token found ' + req.headers.authorization);
        return apiResponse.unauthorizedResponse(res, 'Invalid token.');
    }
    try {
        // default values if query does not specify a value
        var query = {};
        var limit = 10;
        if (req.query.limit) 
            limit = parseInt(req.query.limit);
        if (req.query.isPredict)
            query.isPredict = (req.query.isPredict == 'true');
        const docs = imageModel.find(query).sort({_id: -1}).limit(limit); // gets the most recent 5 documents in the image collection
        docs.lean().exec(function (err, images) { // transforms documents into JSON
            if (err) 
                throw err;
            else
                return apiResponse.successResponseWithData(res, 'Images Sent Succesfully', JSON.stringify(images));
        })
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

module.exports = router;
