const express = require("express");
const { model } = require("mongoose");
const apiResponse = require("../helpers/apiResponse");
const imageModel = require("../models/imageModel");
const jwt = require("jsonwebtoken");
const sensorModel = require("../models/sensorModel");
// const userModel = require("../models/userModel");
var net = require('net');

var client = new net.Socket();
var router = express.Router();
// testMongo();
// deleteImageCollection();
// addTestAccount();
var isNotLimiting = true;

async function testMongo() {
    // reads all the iamges stored in the database
    const doc = await imageModel.find();
    console.log(doc);
}

async function deleteImageCollection() {
    // Deletes all the non-predict images
    // for testing purposes only
    imageModel.remove({isPredict: false}, function(err, result) {
        if (err) {
          console.err(err);
        } else {
          console.log('success?');
        }
      });

      imageModel.remove({isPredict: true}, function(err, result) {
        if (err) {
          console.err(err);
        } else {
          console.log('success?');
        }
      });
}

// TODO: inform camera app when something is detected with the sonsors
router.post('/togglesystem', function(req, res) {
    // TODO: Disable/enable push notifications (and maybe predictions?)
    // Would basically enable/disable the system 
    try {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    } catch (error) {
        console.log('invalid token found ' + req.headers.authorization);
        return apiResponse.unauthorizedResponse(res, 'Invalid token.');
    }
    try {
        // enable/disable here
        return apiResponse.successResponse(res, 'Toggle Success');
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

router.get('/getimages', function(req, res) {
    // TODO: Make sure it is a logged-in user sending, not anyone else
    try {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    } catch (error) {
        console.log('invalid token found ' + req.headers.authorization);
        return apiResponse.unauthorizedResponse(res, 'Invalid token.');
    }
    try {
        const docs = imageModel.find().sort({_id: -1}).limit(10); // gets the most recent 5 documents in the image collection
        docs.lean().exec(function (err, images) { // transforms documents into JSON
            if (err) 
                throw err;
            else
                return apiResponse.successResponseWithData(res, 'Prediction Success', JSON.stringify(images));
        })
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

router.get('/getpredictedimages', function(req, res) {
    // TODO: Make sure it is a logged-in user sending, not anyone else
    try {
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    } catch (error) {
        console.log('invalid token found ' + req.headers.authorization);
        return apiResponse.unauthorizedResponse(res, 'Invalid token.');
    }
    try {
        const docs = imageModel.find({isPredict: true}).sort({_id: -1}).limit(10); // gets the most recent 5 documents in the image collection
        docs.lean().exec(function (err, images) { // transforms documents into JSON
            if (err) 
                throw err;
            else
                return apiResponse.successResponseWithData(res, 'Prediction Success', JSON.stringify(images));
        })
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});


module.exports = router;
