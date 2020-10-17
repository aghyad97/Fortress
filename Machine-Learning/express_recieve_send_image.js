var expess = require("express");
var bodyParser = require("body-parser");;
var app = expess();
var request = require("request");

var optionsProcess = {
  url: 'http://127.0.0.1:5000/process',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}

async function base64_encode(base64image, optionsProcess) {
  // read binary data and convert it to base64
  console.time('predictImage');

  optionsProcess.json = {
    'image': base64image
  };
  request(optionsProcess, (error, response, body) => {
    console.log(error);
    console.log(body);
    console.timeEnd('predictImage');
  });
  return base64image;
}

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.post("/image", function(req, res){
  console.log('recieved image from flutter');
  var img = req.body.image;
  base64_encode(img, optionsProcess)
   res.send("OK");
 });

app.listen(3000);