var expess = require("express");
var bodyParser = require("body-parser");;
var app = expess();
var request = require("request");
var tf = require("@tensorflow/tfjs-node");

async function detectPerson(inputImage, model) {
  // read binary data and convert it to base64

  await model
  let imageArray = new Uint8Array(inputImage); // replace with imageData when decoding base64
  let tensor3d = tf.node.decodeJpeg( imageArray, 3 );
  tensor3d = tf.image.resizeBilinear(tensor3d, [224,224]);
  tensor3d = tensor3d.sub(tensor3d.min()).div(tensor3d.max().sub(tensor3d.min()));
  tensor3d = tensor3d.reshape([1, 224, 224, 3])
  
  console.time('predictImage');
  prediction = model.predict(tensor3d);
  console.timeEnd('predictImage');
  prediction.print();
  return prediction
}

async function startServer() {
  const model = await tf.loadLayersModel('https://raw.githubusercontent.com/Internet-and-IoT-Lab-group/COE457-Labs/master/test stuff/EN3_PersonNoPerson_classifier_TfJS/model.json');
  
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.post("/api/image", function(req, res){
    console.log('recieved image from flutter');
    console.log(req.headers['content-length']);
    return res.send("OK");

    var img = req.body.image;
    img = Buffer.from(img,"base64");
    detectPerson(img, model)
    res.send("OK");
  });

  app.listen(3000);
}

startServer()