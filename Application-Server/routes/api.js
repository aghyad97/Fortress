const express = require("express");
const tf = require("@tensorflow/tfjs-node");
const { model } = require("mongoose");
const apiResponse = require("../helpers/apiResponse");
const imageModel = require("../models/imageModel");
var router = express.Router();
const date = new Date();
const tensorflowModel = loadModel();

async function loadModel() {
    var loadedModel = await tf.loadLayersModel('https://raw.githubusercontent.com/Internet-and-IoT-Lab-group/COE457-Labs/master/test stuff/EN3_PersonNoPerson_classifier_TfJS/model.json');
    return loadedModel;
}



async function runPredictionOnBase64Image(inputImage, tensorflowModel) {
    tensorflowModel = await tensorflowModel; // make sure model is loaded
    let imageArray = new Uint8Array(inputImage); // replace with imageData when decoding base64
    let tensor3d = tf.node.decodeJpeg(imageArray, 3);
    tensor3d = tf.image.resizeBilinear(tensor3d, [224,224]);
    tensor3d = tensor3d.sub(tensor3d.min()).div(tensor3d.max().sub(tensor3d.min()));
    tensor3d = tensor3d.expandDims()

    console.time('predictImage');
    prediction = tensorflowModel.predict(tensor3d);
    console.timeEnd('predictImage');
    prediction.print();
    return prediction;
}

async function connectToPhoneSensors() {
    // TODO: connect to phone and get sensor information

}

// TODO: inform camera app when something is detected with the sonsors

router.get('/getimages', function(req, res) {
    // TODO: Make sure it is a logged-in user sending, not anyone else
    // TODO: send last 5 images to user
    try {
        
    } catch (error) {

    }
});

router.post("/image", function(req, res) {
    // TODO: Make sure it is a logged-in user sending, not anyone else
    try {
        console.log('Recieved image');
        var base64img = req.body.image;
        var userId = mongoose.ObjectId(req.body.userId); // get userId from camera app
        var img = Buffer.from(img,"base64");
        prediction = runPredictionOnBase64Image(img, tensorflowModel);
        isPredict = (prediction[0][0] > 0.60); // true only if probability is >60%
        if (date.getSeconds() % 15) {
            // write to database every 15 seconds
            // need to add user to camera app to be able to write
            imageModel.bulkWrite([{
                insertOne: {
                    userId: userId,
                    image: base64img,
                    isPredict: isPredict,
            }}]);
        }
        if (isPredict) {
            // if person is detected than warn the user on
            // the main application or browser
        }
        return apiResponse.successResponse(res, 'Prediction Success');
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

module.exports = router;
