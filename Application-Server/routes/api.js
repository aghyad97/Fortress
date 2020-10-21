const express = require("express");
const tf = require("@tensorflow/tfjs-node");
const { model } = require("mongoose");
const apiResponse = require("../helpers/apiResponse");

var router = express.Router();

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
    return prediction
}

router.post("/image", function(req, res) {
    try {
        console.log('Recieved image');
        var img = req.body.image;
        img = Buffer.from(img,"base64");
        prediction = runPredictionOnBase64Image(img, tensorflowModel)
        // res.send('finished prediction');
        return apiResponse.successResponse(res, 'Prediction Success');
    } catch (error) {
        return apiResponse.ErrorResponse(res, 'Error');
    }
});

module.exports = router;
