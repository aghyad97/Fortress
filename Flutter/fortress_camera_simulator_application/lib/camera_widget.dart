import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:camera/camera.dart';
import 'package:image/image.dart' as imglib;
import 'dart:convert';
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';
import 'package:tflite/tflite.dart';

class CameraWidget extends StatelessWidget {
  CameraController _controller;
  List<CameraDescription> cameras; // list of camers
  CameraDescription selectedCamera; // currently selected camera
  Future<void> _initializeControllerFuture;
  RxBool available = true.obs;
  var isReady = 0.obs;
  var nSentImages = 0;
  var isTransmitting = false.obs;
  final String serverEndPoint = 'http://192.168.0.119:3000/api/image';
  MqttServerClient mqttClient =
      MqttServerClient('192.168.0.119', 'camera_app'); // port 1883

  CameraWidget() {
    _loadModelAndMqttConnect();
  }
  Future<void> _loadModelAndMqttConnect() async {
    String res = await Tflite.loadModel(
        model: "assets/model.tflite",
        labels: "assets/labels.txt",
        numThreads: 1, // defaults to 1
        isAsset:
            true, // defaults to true, set to false to load resources outside assets
        useGpuDelegate:
            false // defaults to false, set to true to use GPU delegate
        );
    await mqttClient.connect();
    print(res);
    print('finished loading model and connecting to client');
  }

  Future<void> getCameras() async {
    // gets the cameras list
    cameras = await availableCameras();
    print('initialized camera list');
    // takes the first camera found
    // change to make it selectable in the future
    selectedCamera = cameras.first;

    print('initialized camera with name ' + selectedCamera.name);
    _controller = CameraController(
      selectedCamera,
      ResolutionPreset.low,
    );
    _initializeControllerFuture = _controller.initialize();
    await _initializeControllerFuture;
    isReady++;
    print('isReady ${isReady}');
  }

  imglib.Image _convertYUV420(CameraImage image) {
    var img = imglib.Image(
      image.width,
      image.height,
    ); // Create Image buffer
    final int uvRowStride = image.planes[1].bytesPerRow;
    final int uvPixelStride = image.planes[1].bytesPerPixel;

    // Fill image buffer with plane[0] from YUV420_888
    for (int x = 0; x < image.width; x++) {
      for (int y = 0; y < image.height; y++) {
        final int uvIndex =
            uvPixelStride * (x / 2).floor() + uvRowStride * (y / 2).floor();
        final int index = y * image.width + x;

        final yp = image.planes[0].bytes[index];
        final up = image.planes[1].bytes[uvIndex];
        final vp = image.planes[2].bytes[uvIndex];
        // Calculate pixel color
        int r = (yp + vp * 1436 / 1024 - 179).round().clamp(0, 255);
        int g = (yp - up * 46549 / 131072 + 44 - vp * 93604 / 131072 + 91)
            .round()
            .clamp(0, 255);
        int b = (yp + up * 1814 / 1024 - 227).round().clamp(0, 255);
        // color: 0x FF  FF  FF  FF
        //           A   B   G   R
        img.data[index] = (0xFF << 24) | (b << 16) | (g << 8) | r;
      }
    }

    return img;
  }

  // coversion functions from
  // https://gist.github.com/Alby-o/fe87e35bc21d534c8220aed7df028e03#gistcomment-3218349

  Future<String> convertImagetoPng(CameraImage image) async {
    try {
      imglib.Image img;
      if (image.format.group == ImageFormatGroup.yuv420) {
        img = _convertYUV420(image);
      }

      imglib.JpegEncoder jpegEncoder = new imglib.JpegEncoder();

      // // Convert to png
      List<int> convertedImage = jpegEncoder.encodeImage(img);
      final base64image = base64Encode(convertedImage);

      return base64image;
    } catch (e) {
      print(">>>>>>>>>>>> ERROR:" + e.toString());
    }
  }

  _predict(CameraImage img) async {
    print('predicting!');
    var recognitions = await Tflite.runModelOnFrame(
        bytesList: img.planes.map((plane) {
          return plane.bytes;
        }).toList(), // required
        imageHeight: img.height,
        imageWidth: img.width,
        imageMean: 127.5, // defaults to 127.5
        imageStd: 127.5, // defaults to 127.5
        rotation: 90, // defaults to 90, Android only
        numResults: 2, // defaults to 5
        threshold: 0.1, // defaults to 0.1
        asynch: true // defaults to true
        );
    print(recognitions);
    if (recognitions.isNotEmpty) if (recognitions[0]['confidence'] >= 0.6) {
      if (available.value) {
        // makes sure only 1 predict will go in the span of 2 seconds
        available.toggle(); // set false to lock the function
        print('found prediction!!!!');
        _publishImage(img, 'project/images', true);
        await Future.delayed(const Duration(seconds: 5), () => "5");
        available.toggle();
      }
      return recognitions;
    }
  }

  _publishImage(CameraImage img, String topic, bool prediction) async {
    final base64image = await convertImagetoPng(img);
    final String stringToPublish =
        json.encode({'image': base64image, 'isPredict': prediction});
    final publishBuilder = MqttClientPayloadBuilder();
    publishBuilder.addString(stringToPublish);
    mqttClient.publishMessage(
        topic, MqttQos.exactlyOnce, publishBuilder.payload);
  }

  _processImageAndPredict(CameraImage img) {
    if ((nSentImages % 15) == 1 && isTransmitting.value) {
      // predict around every 0.5 seconds
      _predict(img);
    }
    if ((nSentImages % 150) == 1 && isTransmitting.value) {
      // predict around every 5 seconds
      print('publishing');
      _publishImage(img, 'project/images', false);
    }
    nSentImages++;
  }

  Future<void> infinitePictureCapture() async {
    try {
      await _initializeControllerFuture; // await to make sure it initalized

      _controller?.startImageStream((image) => _processImageAndPredict(image));
    } catch (e) {
      print(e);
    }
  }

  void _startStopImageUpload() {
    // starts transmitting if not transmitting
    // and stops transmitting if currently transmitting
    isTransmitting.toggle(); // flips bool value of isTransmitting
    if (isTransmitting.value)
      Get.snackbar(
        'Image Upload',
        'Starting',
        backgroundColor: Colors.grey[400],
      );
    else
      Get.snackbar(
        'Image Upload',
        'Stopping',
        backgroundColor: Colors.grey[400],
      );
  }

  @override
  Widget build(BuildContext context) {
    final _cameraFutureBuilder = FutureBuilder(
      future: getCameras(), // which future to wait till complete
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          isReady++;
          // when future is done and camera is initialized
          print('initialized controller');
          if (isReady > 0) {
            final _cameraPreview = CameraPreview(_controller);
            infinitePictureCapture();
            return _cameraPreview;
          } else {
            return Center(child: CircularProgressIndicator());
          }
        } else {
          // when future is not yet done
          return Center(child: CircularProgressIndicator());
        }
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Security Camera Simulator',
        ),
      ),
      body: Center(
        child: _cameraFutureBuilder,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _startStopImageUpload(),
        child: Icon(
          Icons.file_upload,
          color: Colors.black,
        ),
      ),
    );
  }
}
