const express = require("express");
const tf = require("@tensorflow/tfjs-node");
const { model } = require("mongoose");
const apiResponse = require("../helpers/apiResponse");
const imageModel = require("../models/imageModel");
const sensorModel = require("../models/sensorModel");
// const userModel = require("../models/userModel");
var net = require('net');

var client = new net.Socket();
var router = express.Router();
const tensorflowModel = loadModel();
// testMongo();
// deleteImageCollection();
// addTestAccount();
connectToPhoneSensors();
var isNotLimiting = true;
async function loadModel() {
    var loadedModel = await tf.loadLayersModel('https://raw.githubusercontent.com/Internet-and-IoT-Lab-group/COE457-Labs/master/test stuff/EN3_PersonNoPerson_classifier_TfJS/model.json');
    return loadedModel;
}

async function testMongo() {
    // reads all the iamges stored in the database
    const doc = await userModel.find();
    console.log(doc);
}

async function addTestAccount() {
    let userData = new userModel({
        fullName: 'Saif AlNajjar',
        email: 'saif899056@gmail.com',
        password: '$2y$12$VCNGdgGaUJoVKM9YhMp50uSoFfI52OKv1jWavUgcuMz71N5RzhAqq',
        isConfirmed: true
    });
    userData.save(function(err, userData) {
        if (err) console.log(err);
        else
            console.log('adding success');
    });
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

async function runPredictionOnBase64Image(inputImage, tensorflowModel) {
    tensorflowModel = await tensorflowModel; // make sure model is loaded
    let imageArray = new Uint8Array(inputImage); // replace with imageData when decoding base64
    let tensor3d = tf.node.decodeJpeg(imageArray, 3);
    tensor3d = tf.image.resizeBilinear(tensor3d, [224,224]);
    tensor3d = tensor3d.sub(tensor3d.min()).div(tensor3d.max().sub(tensor3d.min()));
    tensor3d = tensor3d.expandDims()

    prediction = tensorflowModel.predict(tensor3d);
   // prediction.print();
    return prediction;
}

let acc;
function startSocketConnection () {
    client.connect(4242, '10.0.1.118', function() {
        console.log("connected to the logger");
    });
}
async function connectToPhoneSensors() {
    // TODO: connect to phone and get sensor information
    startSocketConnection();

    client.on('data', function(data) {
        try{
            //convert data to a JSON object
            acc = JSON.parse(data.toString());
            console.log(acc);
            accValues = acc.accelerometer.value;
        }
        catch(error) {
            console.log(error);
        }
    });
    client.on('close', function() {
        console.log('Connection closed');
        setTimeout(startSocketConnection, 5000); // wait 5 seconds then attempt reconnection to phone
        console.log('retrying connection');
    });
    client.on('error', async function(err) {
        //console.log(err)
    })

}

// TODO: inform camera app when something is detected with the sonsors

router.get('/getimages', function(req, res) {
    // TODO: Make sure it is a logged-in user sending, not anyone else
    try {
        const docs = imageModel.find().sort({_id: -1}).limit(5) // gets the most recent 5 documents in the image collection
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

router.post("/image", function(req, res) {
    // TODO: Make sure it is a logged-in user sending, not anyone else
    try {
        const date = new Date();
        if ((date.getSeconds() % 5 == 0) && !isNotLimiting) // one image per 5 seconds, this only work if 1 user is in system!!!!
            isNotLimiting = true;                           // there are some race conditions so this isn't working 100% properly
        var base64img = req.body.image;
        var img = Buffer.from(base64img,"base64");
        runPredictionOnBase64Image(img, tensorflowModel).then((prediction) => { // waits for prediction to be done
            isPredict = prediction.arraySync()[0][0] > 0.60; // true only if probability is >60%
            if (isPredict && isNotLimiting) {
            isNotLimiting = false;
            console.log(isPredict);
                // if person is detected than warn the user on
                // the main application or browser
                // and write to mongodb
                const imageDocument = new imageModel({
                    image: base64img,
                    isPredict: isPredict,
                })
                imageDocument.save(function (err, imageDocument) {
                    if (err) return console.error(err);
                    console.log('success');
                  });        
            }
                // TODO: warn the main application
        });
        if ((date.getSeconds() % 15 == 0) && date.getMilliseconds() <= 500) {
            // write to database once every 15 seconds
            // need to add user to camera app to be able to write
            console.log('Writing image to MongoDB');
            const imageDocument = new imageModel({
                image: base64img,
                isPredict: false,
            })
            
            imageDocument.save(function (err, imageDocument) {
                if (err) return console.error(err);
                console.log('success');
              });        
            }
        return apiResponse.successResponse(res, 'Prediction Success');
    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

module.exports = router;
